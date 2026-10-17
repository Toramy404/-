$ErrorActionPreference = 'Stop'
$previewRoot = $PSScriptRoot
$previewUrl = 'http://127.0.0.1:4318/'
$env:NIGHTREIGN_PORT = '4318'
$ready = $false
try {
    $health = Invoke-RestMethod ($previewUrl + 'health') -TimeoutSec 2
    if ($health.app -eq 'nightreign-local' -and $health.root -eq (Join-Path $previewRoot 'dist')) { $ready = $true }
    else { throw 'Port 4318 belongs to another application.' }
} catch {}
if (-not $ready) {
    $nodeCommand = Get-Command node -ErrorAction SilentlyContinue
    $nodePath = if ($nodeCommand) { $nodeCommand.Source } else { 'C:\Program Files\nodejs\node.exe' }
    if (-not (Test-Path -LiteralPath $nodePath)) {
        Start-Process (Join-Path $previewRoot 'dist\index.html')
        exit
    }
    $server = Start-Process -FilePath $nodePath -ArgumentList 'serve.mjs' -WorkingDirectory $previewRoot -WindowStyle Hidden -PassThru -RedirectStandardOutput (Join-Path $previewRoot 'preview.stdout.log') -RedirectStandardError (Join-Path $previewRoot 'preview.stderr.log')
    $server.Id | Set-Content (Join-Path $previewRoot 'preview.pid')
    for ($attempt = 0; $attempt -lt 30; $attempt++) {
        Start-Sleep -Milliseconds 100
        try {
            $health = Invoke-RestMethod ($previewUrl + 'health') -TimeoutSec 1
            if ($health.app -eq 'nightreign-local' -and $health.root -eq (Join-Path $previewRoot 'dist')) { $ready = $true; break }
        } catch {}
    }
}
if ($ready) { Start-Process ($previewUrl + '#home') }
else { Start-Process (Join-Path $previewRoot 'dist\index.html') }

