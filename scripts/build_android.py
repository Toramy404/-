"""Build and sign the offline Android APK using Google's verified SDK tools."""
from pathlib import Path
import argparse,hashlib,json,os,re,shutil,subprocess,sys,tempfile,zipfile
import xml.etree.ElementTree as ET
if hasattr(sys.stdout,'reconfigure'):sys.stdout.reconfigure(encoding='utf-8')
APP=Path(__file__).resolve().parents[1]
ROOT=APP.parent
NATIVE=APP/'android'
MANIFEST=ET.parse(NATIVE/'AndroidManifest.xml').getroot()
ANDROID_NS='{http://schemas.android.com/apk/res/android}'
VERSION=MANIFEST.attrib[ANDROID_NS+'versionName']
VERSION_CODE=int(MANIFEST.attrib[ANDROID_NS+'versionCode'])
parser=argparse.ArgumentParser(description=__doc__)
mode=parser.add_mutually_exclusive_group(required=True)
mode.add_argument('--unsigned',action='store_true',help='Compile and verify without signing; not installable')
mode.add_argument('--signed',action='store_true',help='Sign with the existing local release key')
parser.add_argument('--previous',type=Path,help='Previous released APK, required for signed upgrade checks')
parser.add_argument('--output',type=Path,help='New output path; existing files are never overwritten')
args=parser.parse_args()
assert re.fullmatch(r'\d+\.\d+\.\d+',VERSION), 'Expected numeric major.minor.patch'
if args.signed and not args.previous:parser.error('--signed requires --previous APK to verify the upgrade identity')
BUILD_PARENT=NATIVE/'build'/('v'+VERSION);BUILD_PARENT.mkdir(parents=True,exist_ok=True)
BUILD=Path(tempfile.mkdtemp(prefix='unsigned-' if args.unsigned else 'signed-',dir=BUILD_PARENT))
TOOLS=ROOT/'work/nightreign/android-tools'
SDK=os.environ.get('ANDROID_SDK_ROOT') or os.environ.get('ANDROID_HOME')
BT=Path(os.environ['NIGHTREIGN_BUILD_TOOLS']) if os.environ.get('NIGHTREIGN_BUILD_TOOLS') else (Path(SDK)/'build-tools/35.0.1' if SDK else TOOLS/'build-tools-35.0.1/android-15')
ANDROID=Path(os.environ['NIGHTREIGN_ANDROID_JAR']) if os.environ.get('NIGHTREIGN_ANDROID_JAR') else (Path(SDK)/'platforms/android-35/android.jar' if SDK else TOOLS/'platforms-android-35/android-35/android.jar')
JDK_SETTING=os.environ.get('NIGHTREIGN_JDK') or os.environ.get('JAVA_HOME')
JAVAC_ON_PATH=shutil.which('javac')
JDK=Path(JDK_SETTING) if JDK_SETTING else (Path(JAVAC_ON_PATH).resolve().parents[1] if JAVAC_ON_PATH else None)
if JDK is None:raise SystemExit('Set JAVA_HOME or NIGHTREIGN_JDK to JDK 17 or newer.')
EXE='.exe' if os.name=='nt' else ''
JAVA=JDK/('bin/java'+EXE)
for required in (JAVA,JDK/('bin/javac'+EXE),ANDROID,BT/('aapt2'+EXE),BT/('zipalign'+EXE),BT/'lib/d8.jar'):
    if not required.exists():raise SystemExit('Missing build prerequisite: '+str(required))
OUT=BUILD/('duye-v'+VERSION+('.unsigned.apk' if args.unsigned else '.apk'))
DELIVERY=args.output.resolve() if args.output else (OUT if args.unsigned else APP/'release'/('渡夜手册-v'+VERSION+'.apk'))
if DELIVERY.exists():raise SystemExit('Output exists; never overwrite a released APK: '+str(DELIVERY))
PREVIOUS=args.previous.resolve() if args.previous else None
if args.signed:
    assert PREVIOUS.is_file(),'Previous released APK is missing'
    assert (NATIVE/'signing/duye-release.jks').is_file() and (NATIVE/'signing/password.txt').is_file(),'Existing signing identity is required; never generate a replacement for an update'
QA=APP/'reports'/('android-v'+VERSION)/('unsigned' if args.unsigned else 'signed')
LOG=[]
for p in (BUILD,BUILD/'assets/www',BUILD/'classes',BUILD/'dex',APP/'release',QA):p.mkdir(parents=True,exist_ok=True)

def run(args):
    # aapt Windows paths must be relative when the workspace contains Chinese.
    command=[str(args[0])]+[('./'+os.path.relpath(a,ROOT)) if isinstance(a,Path) and a.is_relative_to(ROOT) else str(a) for a in args[1:]]
    result=subprocess.run(command,cwd=ROOT,capture_output=True,encoding='utf-8',errors='replace')
    LOG.append({'tool':Path(str(args[0])).name,'returncode':result.returncode,'stdout':result.stdout,'stderr':result.stderr})
    (QA/'android-build-log.json').write_text(json.dumps(LOG,ensure_ascii=False,indent=2),'utf-8')
    if result.returncode:
        print(result.stdout,result.stderr)
        raise RuntimeError('Build step failed: '+str(args[0]))
    return result.stdout

# Assets are copied from the maintained preview; original game records stay byte-identical.
asset_root=BUILD/'assets/www'
source_hashes={}
old_staged_image=asset_root/'assets/大空洞地表水晶原图.jpg'
if old_staged_image.exists():old_staged_image.unlink()
for p in (APP/'dist').rglob('*'):
    if not p.is_file() or p.name in ('sw.js','manifest.webmanifest'):continue
    relative=p.relative_to(APP/'dist')
    source_hashes[relative.as_posix()]=hashlib.sha256(p.read_bytes()).hexdigest()
    if relative.name=='大空洞地表水晶原图.jpg':relative=relative.with_name('great-hollow-original.jpg')
    dest=asset_root/relative;dest.parent.mkdir(parents=True,exist_ok=True)
    shutil.copy2(p,dest)
index=(asset_root/'index.html').read_text('utf-8-sig')
index=re.sub(r'<link rel="manifest"[^>]*>','',index)
index=index.replace('</head>','<style>.top-tools [data-action="phone"]{display:none!important}</style></head>')
(asset_root/'index.html').write_text(index,'utf-8')
js=(asset_root/'app.js').read_text('utf-8-sig').replace('assets/大空洞地表水晶原图.jpg','assets/great-hollow-original.jpg')
needle="  var blob=new Blob([JSON.stringify({app:'渡夜手册',version:2,favorites:state.favorites,crystalMarks:state.marks,recent:state.recent,display:{density:state.density,fontSize:state.fontSize}},null,2)]"
assert js.count(needle)==1
hook="  if(window.NightreignNative){window.NightreignNative.savePreferences(JSON.stringify({app:'渡夜手册',version:2,favorites:state.favorites,crystalMarks:state.marks,recent:state.recent,display:{density:state.density,fontSize:state.fontSize}},null,2));return;}\n"
js=js.replace(needle,hook+needle)
worker="if('serviceWorker' in navigator&&location.protocol!=='file:'){"
assert js.count(worker)==1
js=js.replace(worker,"if(false){ // Packaged assets provide offline access in Android.")
# Packaged UI describes the installed app, while the desktop preview remains a preview.
replacements={
 '体验预览 · v0.4':'离线版 · v'+VERSION,
 '电脑预览在首页提示退出位置，安卓应用在首页返回时退出。':'',
 '页面、资料和地图均从本机载入，不依赖在线字体或数据服务。首次访问完成缓存后，同一浏览器可离线重开；也可直接打开文件夹里的 index.html。':'页面、资料和地图随安装包保存，断网也能直接查阅。来源链接在系统浏览器中打开。',
 '收藏和水晶标记仅保存在当前浏览器。换浏览器、清理网站数据或使用不同地址会得到独立记录。本轮为 v0.4 电脑预览，已发布的安卓安装包仍为 v0.3.0。':'收藏、水晶标记和显示偏好保存在本机。覆盖升级保留记录；卸载或清除应用数据会清空记录。安卓离线版 v'+VERSION+'。'
}
for old,new in replacements.items():
    assert old in js, 'Packaged copy replacement missing: '+old
    js=js.replace(old,new)
(asset_root/'app.js').write_text(js,'utf-8')
assert (asset_root/'data.js').read_bytes()==(APP/'dist/data.js').read_bytes()

# UTF-8 source normalization is for Java compilation only.
java_sources=[]
for p in (NATIVE/'src').rglob('*.java'):
    dest=BUILD/'src'/p.relative_to(NATIVE/'src');dest.parent.mkdir(parents=True,exist_ok=True)
    dest.write_text(p.read_text('utf-8-sig'),'utf-8');java_sources.append(dest)
print('Compiling Android resources and Java...',flush=True)
run([BT/('aapt2'+EXE),'compile','--dir',NATIVE/'res','-o',BUILD/'resources.zip'])
run([BT/('aapt2'+EXE),'link','-o',BUILD/'unsigned.apk','-I',ANDROID,'--manifest',NATIVE/'AndroidManifest.xml','--min-sdk-version','26','--target-sdk-version','35','-A',BUILD/'assets',BUILD/'resources.zip'])
run([JDK/('bin/javac'+EXE),'-encoding','UTF-8','--release','8','-classpath',ANDROID,'-d',BUILD/'classes',*java_sources])
with zipfile.ZipFile(BUILD/'classes.jar','w',zipfile.ZIP_DEFLATED) as z:
    for p in (BUILD/'classes').rglob('*.class'):z.write(p,p.relative_to(BUILD/'classes').as_posix())
run([JAVA,'-cp',BT/'lib/d8.jar','com.android.tools.r8.D8','--release','--min-api','26','--lib',ANDROID,'--output',BUILD/'dex',BUILD/'classes.jar'])
# Normalize ZIP local/central headers before alignment, preserving stored resources.
with zipfile.ZipFile(BUILD/'unsigned.apk') as source, zipfile.ZipFile(BUILD/'unsigned-with-code.apk','w') as z:
    for item in source.infolist():
        z.writestr(item.filename, source.read(item.filename), compress_type=item.compress_type)
    z.write(BUILD/'dex/classes.dex','classes.dex',compress_type=zipfile.ZIP_DEFLATED)
run([BT/('zipalign'+EXE),'-f','-p','4',BUILD/'unsigned-with-code.apk',BUILD/'aligned.apk'])
if args.unsigned:
    shutil.copy2(BUILD/'aligned.apk',OUT)
    run([BT/('zipalign'+EXE),'-c','4',OUT])
    badge=run([BT/('aapt'+EXE),'dump','badging',OUT])
    perms=run([BT/('aapt'+EXE),'dump','permissions',OUT])
    assert 'uses-permission:' not in perms
    assert ("versionName='"+VERSION+"'") in badge
    with zipfile.ZipFile(OUT) as z:
        assert z.testzip() is None
        assert z.read('classes.dex')[:4]==b'dex\n'
        for p in asset_root.rglob('*'):
            if p.is_file():assert z.read('assets/www/'+p.relative_to(asset_root).as_posix())==p.read_bytes()
    for relative,digest in source_hashes.items():assert hashlib.sha256((APP/'dist'/relative).read_bytes()).hexdigest()==digest
    if DELIVERY!=OUT:
        DELIVERY.parent.mkdir(parents=True,exist_ok=True);DELIVERY.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(OUT,DELIVERY)
    print(json.dumps({'unsigned_apk':str(DELIVERY),'compilation':'passed','all_assets_match':True,'permissions':[],'installable':False},ensure_ascii=False))
    raise SystemExit(0)
signing=NATIVE/'signing';signing.mkdir(exist_ok=True)
key=signing/'duye-release.jks';password=signing/'password.txt'
assert key.exists(), 'Never replace the established signing key during an upgrade'
assert password.exists(),'Signing password must be preserved with the keystore'
run([JAVA,'-jar',BT/'lib/apksigner.jar','sign','--ks',key,'--ks-key-alias','duye','--ks-pass','file:'+str(password),'--v1-signing-enabled','true','--v2-signing-enabled','true','--v3-signing-enabled','true','--out',OUT,BUILD/'aligned.apk'])
verification=run([JAVA,'-jar',BT/'lib/apksigner.jar','verify','--verbose','--print-certs',OUT])
alignment=run([BT/('zipalign'+EXE),'-c','-v','4',OUT])
badging=run([BT/('aapt'+EXE),'dump','badging',OUT])
permissions=run([BT/('aapt'+EXE),'dump','permissions',OUT])
previous_stage=BUILD/'previous.apk'
shutil.copyfile(PREVIOUS,previous_stage)
previous_verification=run([JAVA,'-jar',BT/'lib/apksigner.jar','verify','--print-certs',previous_stage])
previous_badging=run([BT/('aapt'+EXE),'dump','badging',previous_stage])
cert_pattern=r'Signer #1 certificate SHA-256 digest: ([0-9a-f]+)'
assert re.search(cert_pattern,verification).group(1)==re.search(cert_pattern,previous_verification).group(1), 'Upgrade certificate mismatch'
assert int(re.search(r"versionCode='(\d+)'",previous_badging).group(1))<VERSION_CODE
assert ("versionCode='"+str(VERSION_CODE)+"'") in badging and ("versionName='"+VERSION+"'") in badging
assert "name='local.duye.nightreign'" in badging
assert "sdkVersion:'26'" in badging and "targetSdkVersion:'35'" in badging
assert 'uses-permission:' not in permissions
assert 'Verified using v2 scheme (APK Signature Scheme v2): true' in verification
assert 'Verified using v3 scheme (APK Signature Scheme v3): true' in verification
with zipfile.ZipFile(OUT) as z:
    assert z.testzip() is None
    assert z.read('assets/www/data.js')==(APP/'dist/data.js').read_bytes()
    for p in asset_root.rglob('*'):
        if p.is_file():assert z.read('assets/www/'+p.relative_to(asset_root).as_posix())==p.read_bytes()
    assert z.read('classes.dex')[:4]==b'dex\n'
    assert not any('signing' in p or p.endswith('.jks') or p.endswith('password.txt') for p in z.namelist())
    asset_count=sum(n.startswith('assets/www/') and not n.endswith('/') for n in z.namelist())
for relative,digest in source_hashes.items():assert hashlib.sha256((APP/'dist'/relative).read_bytes()).hexdigest()==digest
DELIVERY.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(OUT,DELIVERY)
assert DELIVERY.read_bytes()==OUT.read_bytes()
report={'apk':str(DELIVERY),'bytes':OUT.stat().st_size,'sha256':hashlib.sha256(OUT.read_bytes()).hexdigest(),'package':'local.duye.nightreign','version':VERSION,'version_code':VERSION_CODE,'same_signer_as_previous':True,'min_android':'8.0 (API 26)','target_api':35,'permissions':[],'crc_passed':True,'all_assets_match_build':True,'data_js_byte_identical_to_preview':True,'preview_files_unchanged':True,'asset_count':asset_count,'signature':verification,'zipalign':alignment.splitlines()[-1],'badging':badging,'android_runtime_test':'not_yet_run'}
(QA/'android-apk-verification.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),'utf-8')
(QA/'android-badging.txt').write_text(badging,'utf-8')
print(json.dumps({k:v for k,v in report.items() if k not in ('signature','badging')},ensure_ascii=False,indent=2))
