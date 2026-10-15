package local.duye.nightreign;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.graphics.Color;
import android.graphics.Insets;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.webkit.JavascriptInterface;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.FrameLayout;
import android.widget.Toast;
import android.view.WindowInsets;
import android.window.OnBackInvokedDispatcher;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;
import java.util.Collections;
import org.json.JSONObject;

/** Offline app host. Only packaged assets are rendered inside this WebView. */
public final class MainActivity extends Activity {
    private static final String HOST = "appassets.androidplatform.net";
    private static final String START = "https://" + HOST + "/assets/index.html";
    private static final int EXPORT_REQUEST = 41;
    private WebView web;
    private String pendingExport;

    @Override public void onCreate(Bundle state) {
        super.onCreate(state);
        FrameLayout frame = new FrameLayout(this);
        frame.setBackgroundColor(Color.rgb(17, 23, 27));
        web = new WebView(this);
        web.setBackgroundColor(Color.rgb(17, 23, 27));
        frame.addView(web, new FrameLayout.LayoutParams(-1, -1));
        setContentView(frame);
        if (Build.VERSION.SDK_INT >= 30) {
            getWindow().setDecorFitsSystemWindows(false);
            frame.setOnApplyWindowInsetsListener((view, insets) -> {
                Insets safe = insets.getInsets(WindowInsets.Type.systemBars()
                        | WindowInsets.Type.displayCutout() | WindowInsets.Type.ime());
                view.setPadding(safe.left, safe.top, safe.right, safe.bottom);
                return WindowInsets.CONSUMED;
            });
            frame.requestApplyInsets();
        }
        WebSettings settings = web.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setAllowFileAccess(false);
        settings.setAllowContentAccess(false);
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
        settings.setSupportMultipleWindows(false);
        settings.setJavaScriptCanOpenWindowsAutomatically(false);
        settings.setMediaPlaybackRequiresUserGesture(true);
        settings.setTextZoom(100);
        if (Build.VERSION.SDK_INT >= 29) settings.setForceDark(WebSettings.FORCE_DARK_OFF);
        web.setWebContentsDebuggingEnabled(false);
        web.setWebChromeClient(new WebChromeClient());
        web.setWebViewClient(new LocalClient());
        web.addJavascriptInterface(new ExportBridge(), "NightreignNative");
        if (Build.VERSION.SDK_INT >= 33) {
            getOnBackInvokedDispatcher().registerOnBackInvokedCallback(
                    OnBackInvokedDispatcher.PRIORITY_DEFAULT, this::handleBack);
        }
        if (state != null) pendingExport = state.getString("pendingExport");
        // The app itself restores its route/query/scroll from localStorage.
        String restored = state == null ? null : state.getString("lastUrl");
        web.loadUrl(restored != null && isLocal(Uri.parse(restored)) ? restored : START);
    }

    private static boolean isLocal(Uri uri) {
        return "https".equals(uri.getScheme()) && HOST.equals(uri.getHost())
                && uri.getUserInfo() == null && uri.getPort() == -1;
    }

    private final class LocalClient extends WebViewClient {
        @Override public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
            Uri uri = request.getUrl();
            String path = uri.getPath();
            if (!"GET".equals(request.getMethod()) || !isLocal(uri) || path == null
                    || !path.startsWith("/assets/") || path.contains("..") || path.indexOf('\\') >= 0) {
                return unavailable();
            }
            String relative = path.substring("/assets/".length());
            try {
                String mime = mimeFor(relative);
                WebResourceResponse response = new WebResourceResponse(mime, "UTF-8",
                        getAssets().open("www/" + relative));
                response.setResponseHeaders(Collections.singletonMap("Cache-Control", "no-store"));
                return response;
            } catch (IOException ex) { return unavailable(); }
        }
        @Override public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
            if (isLocal(request.getUrl())) return false;
            if (request.isForMainFrame()) openExternal(request.getUrl());
            return true;
        }
        @Override public void onReceivedError(WebView view, WebResourceRequest request, android.webkit.WebResourceError error) {
            if (request.isForMainFrame()) Toast.makeText(MainActivity.this,
                    "页面未能载入，请退出后重新打开", Toast.LENGTH_LONG).show();
        }
    }

    private static WebResourceResponse unavailable() {
        return new WebResourceResponse("text/plain", "UTF-8", 404, "Not Found",
                Collections.emptyMap(), new ByteArrayInputStream(new byte[0]));
    }
    private static String mimeFor(String path) {
        if (path.endsWith(".html")) return "text/html";
        if (path.endsWith(".js")) return "application/javascript";
        if (path.endsWith(".css")) return "text/css";
        if (path.endsWith(".svg")) return "image/svg+xml";
        if (path.endsWith(".avif")) return "image/avif";
        if (path.endsWith(".webp")) return "image/webp";
        if (path.endsWith(".jpg")) return "image/jpeg";
        if (path.endsWith(".png")) return "image/png";
        if (path.endsWith(".json")) return "application/json";
        return "text/plain";
    }
    private void openExternal(Uri uri) {
        if (!"https".equals(uri.getScheme()) && !"http".equals(uri.getScheme())) return;
        try { startActivity(new Intent(Intent.ACTION_VIEW, uri).addCategory(Intent.CATEGORY_BROWSABLE)); }
        catch (ActivityNotFoundException ex) { Toast.makeText(this, "没有可打开来源链接的浏览器", Toast.LENGTH_SHORT).show(); }
    }

    private final class ExportBridge {
        @JavascriptInterface public void exitApp() {
            runOnUiThread(() -> {
                if (web.getUrl() != null && web.getUrl().startsWith(START)) finish();
            });
        }

        @JavascriptInterface public void savePreferences(String json) {
            if (json == null || json.length() > 262144) return;
            try {
                JSONObject record = new JSONObject(json);
                if (!"渡夜手册".equals(record.optString("app")) || record.optJSONArray("favorites") == null
                        || record.optJSONObject("crystalMarks") == null) return;
            } catch (Exception ex) { return; }
            runOnUiThread(() -> {
                if (web.getUrl() == null || !web.getUrl().startsWith(START) || pendingExport != null) return;
                pendingExport = json;
                Intent intent = new Intent(Intent.ACTION_CREATE_DOCUMENT);
                intent.addCategory(Intent.CATEGORY_OPENABLE);
                intent.setType("application/json");
                intent.putExtra(Intent.EXTRA_TITLE, "渡夜手册-我的记录.json");
                try { startActivityForResult(intent, EXPORT_REQUEST); }
                catch (ActivityNotFoundException ex) {
                    pendingExport = null;
                    Toast.makeText(MainActivity.this, "此设备没有文件保存器", Toast.LENGTH_LONG).show();
                }
            });
        }
    }
    @Override protected void onActivityResult(int request, int result, Intent data) {
        super.onActivityResult(request, result, data);
        if (request != EXPORT_REQUEST) return;
        String json = pendingExport;
        pendingExport = null;
        if (result != RESULT_OK || data == null || data.getData() == null || json == null) return;
        try (OutputStream stream = getContentResolver().openOutputStream(data.getData())) {
            if (stream == null) throw new IOException("No output stream");
            stream.write(json.getBytes(StandardCharsets.UTF_8));
            Toast.makeText(this, "个人记录已导出", Toast.LENGTH_SHORT).show();
        } catch (IOException ex) { Toast.makeText(this, "保存失败，请重新选择位置", Toast.LENGTH_LONG).show(); }
    }
    private void handleBack() {
        web.evaluateJavascript("window.NR_APP_BACK ? window.NR_APP_BACK() : 'exit'", result -> {
            if ("\"exit\"".equals(result)) finish();
        });
    }

    @Override public void onBackPressed() { handleBack(); }
    @Override protected void onSaveInstanceState(Bundle state) {
        state.putString("lastUrl", web.getUrl());
        state.putString("pendingExport", pendingExport);
        super.onSaveInstanceState(state);
    }
    @Override protected void onPause() { web.onPause(); super.onPause(); }
    @Override protected void onResume() { super.onResume(); if (web != null) web.onResume(); }
    @Override protected void onDestroy() {
        web.removeJavascriptInterface("NightreignNative");
        web.destroy();
        super.onDestroy();
    }
}
