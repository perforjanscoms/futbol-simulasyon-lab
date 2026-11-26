package com.bybora.marketdesk;

import android.app.Activity;
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.graphics.Color;
import android.net.Uri;
import android.os.Bundle;
import android.os.Build;
import android.view.View;
import android.view.Window;
import android.webkit.CookieManager;
import android.webkit.JavascriptInterface;
import android.webkit.SslErrorHandler;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.FrameLayout;
import android.widget.Toast;

import androidx.webkit.WebViewAssetLoader;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.FilterInputStream;
import java.io.OutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;
import org.json.JSONObject;

public final class MainActivity extends Activity {
    private static final String APP_START_URL =
            "https://appassets.androidplatform.net/assets/marketdesk/index.html";
    private static final String WEBVIEW_STATE_KEY = "bybora_marketdesk_webview_state";
    private static final String ALERT_CHANNEL_ID = "bybora_price_alerts";
    private static final int REQUEST_POST_NOTIFICATIONS = 1807;
    private static final int REQUEST_SAVE_WATCHLIST = 1808;
    private static final int REQUEST_OPEN_WATCHLIST = 1809;
    private String pendingWatchlistJson;

    private WebView webView;
    private FrameLayout root;
    private WebViewAssetLoader assetLoader;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        Window window = getWindow();
        window.setStatusBarColor(Color.rgb(8, 15, 29));
        window.setNavigationBarColor(Color.rgb(8, 15, 29));
        window.getDecorView().setSystemUiVisibility(0);

        assetLoader = new WebViewAssetLoader.Builder()
                .addPathHandler("/assets/", new WebViewAssetLoader.AssetsPathHandler(this))
                .build();

        root = new FrameLayout(this);
        root.setBackgroundColor(Color.rgb(8, 15, 29));
        setContentView(root);
        createNotificationChannel();
        createWebView(savedInstanceState);
    }

    private void createWebView(Bundle savedInstanceState) {
        webView = new WebView(this);
        webView.addJavascriptInterface(new MarketDeskBridge(), "ByboraNative");
        webView.setBackgroundColor(Color.rgb(8, 15, 29));
        webView.setLayerType(View.LAYER_TYPE_HARDWARE, null);

        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setLoadWithOverviewMode(true);
        settings.setUseWideViewPort(true);
        settings.setSupportZoom(false);
        settings.setBuiltInZoomControls(false);
        settings.setDisplayZoomControls(false);
        settings.setMediaPlaybackRequiresUserGesture(false);
        settings.setJavaScriptCanOpenWindowsAutomatically(true);
        settings.setSupportMultipleWindows(false);
        settings.setAllowFileAccess(false);
        settings.setAllowContentAccess(false);
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            settings.setSafeBrowsingEnabled(true);
        }
        settings.setCacheMode(WebSettings.LOAD_DEFAULT);

        CookieManager cookies = CookieManager.getInstance();
        cookies.setAcceptCookie(true);
        cookies.setAcceptThirdPartyCookies(webView, true);

        webView.setWebChromeClient(new WebChromeClient());
        webView.setWebViewClient(new WebViewClient() {
            @Override
            public android.webkit.WebResourceResponse shouldInterceptRequest(
                    WebView view, WebResourceRequest request) {
                Uri requestUri = request.getUrl();
                String host = requestUri.getHost();
                if ("api.istfin.com".equalsIgnoreCase(host) ||
                        "data-api.binance.vision".equalsIgnoreCase(host) ||
                        "query1.finance.yahoo.com".equalsIgnoreCase(host) ||
                        "fapi.binance.com".equalsIgnoreCase(host) ||
                        "www.okx.com".equalsIgnoreCase(host) ||
                        "stockanalysis.com".equalsIgnoreCase(host)) {
                    return proxyMarketDataRequest(request);
                }
                return assetLoader.shouldInterceptRequest(requestUri);
            }

            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                if (!request.isForMainFrame()) {
                    return false;
                }
                Uri uri = request.getUrl();
                String host = uri.getHost();
                if ("appassets.androidplatform.net".equalsIgnoreCase(host)) {
                    return false;
                }
                if ("https".equalsIgnoreCase(uri.getScheme()) ||
                        "http".equalsIgnoreCase(uri.getScheme())) {
                    // Keep web destinations inside the BYBORA app WebView.
                    return false;
                }
                if ("mailto".equalsIgnoreCase(uri.getScheme()) ||
                        "tel".equalsIgnoreCase(uri.getScheme())) {
                    openExternal(uri);
                    return true;
                }
                return true;
            }

            @Override
            public void onReceivedError(WebView view, WebResourceRequest request,
                                        WebResourceError error) {
                super.onReceivedError(view, request, error);
                if (request.isForMainFrame()) {
                    Toast.makeText(MainActivity.this,
                            "Bağlantı kurulamadı. İnternet bağlantını kontrol et.",
                            Toast.LENGTH_LONG).show();
                }
            }

            @Override
            public void onReceivedSslError(WebView view, SslErrorHandler handler,
                                           android.net.http.SslError error) {
                handler.cancel();
            }
        });

        root.removeAllViews();
        root.addView(webView, new FrameLayout.LayoutParams(
                FrameLayout.LayoutParams.MATCH_PARENT,
                FrameLayout.LayoutParams.MATCH_PARENT));

        boolean restored = false;
        if (savedInstanceState != null) {
            Bundle webState = savedInstanceState.getBundle(WEBVIEW_STATE_KEY);
            if (webState != null) {
                restored = webView.restoreState(webState) != null;
            }
        }
        if (!restored) {
            webView.loadUrl(APP_START_URL);
        }
    }

    @Override
    protected void onSaveInstanceState(Bundle outState) {
        if (webView != null) {
            Bundle webState = new Bundle();
            if (webView.saveState(webState) != null) {
                outState.putBundle(WEBVIEW_STATE_KEY, webState);
            }
        }
        CookieManager.getInstance().flush();
        super.onSaveInstanceState(outState);
    }

    @Override
    protected void onPause() {
        CookieManager.getInstance().flush();
        super.onPause();
    }


    private void createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(
                    ALERT_CHANNEL_ID, "BYBORA Fiyat Alarmları",
                    NotificationManager.IMPORTANCE_HIGH);
            channel.setDescription("Fiyat seviyesi tetiklendiğinde piyasa alarmı bildirimi.");
            NotificationManager manager = getSystemService(NotificationManager.class);
            if (manager != null) manager.createNotificationChannel(channel);
        }
    }

    public final class MarketDeskBridge {
        @JavascriptInterface
        public boolean hasNotificationPermission() {
            return MainActivity.this.hasNotificationPermission();
        }

        @JavascriptInterface
        public void requestNotificationPermission() {
            runOnUiThread(() -> {
                if (Build.VERSION.SDK_INT >= 33 &&
                        checkSelfPermission("android.permission.POST_NOTIFICATIONS")
                                != PackageManager.PERMISSION_GRANTED) {
                    requestPermissions(
                            new String[]{"android.permission.POST_NOTIFICATIONS"},
                            REQUEST_POST_NOTIFICATIONS);
                }
            });
        }

        @JavascriptInterface
        public void showPriceAlertNotification(String symbol, String message) {
            runOnUiThread(() -> postPriceAlertNotification(symbol, message));
        }

        @JavascriptInterface
        public void saveWatchlistFile(String json) {
            runOnUiThread(() -> beginSaveWatchlistFile(json));
        }

        @JavascriptInterface
        public void openWatchlistFile() {
            runOnUiThread(() -> beginOpenWatchlistFile());
        }
    }

    private boolean hasNotificationPermission() {
        return Build.VERSION.SDK_INT < 33 ||
                checkSelfPermission("android.permission.POST_NOTIFICATIONS")
                        == PackageManager.PERMISSION_GRANTED;
    }

    private void postPriceAlertNotification(String symbol, String message) {
        if (!hasNotificationPermission()) return;
        NotificationManager manager = getSystemService(NotificationManager.class);
        if (manager == null) return;

        Intent intent = new Intent(this, MainActivity.class);
        intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_SINGLE_TOP);
        int flags = PendingIntent.FLAG_UPDATE_CURRENT;
        if (Build.VERSION.SDK_INT >= 23) flags |= PendingIntent.FLAG_IMMUTABLE;
        PendingIntent pendingIntent = PendingIntent.getActivity(this, 1807, intent, flags);

        Notification.Builder builder = Build.VERSION.SDK_INT >= 26
                ? new Notification.Builder(this, ALERT_CHANNEL_ID)
                : new Notification.Builder(this);
        Notification notification = builder
                .setSmallIcon(android.R.drawable.ic_dialog_info)
                .setContentTitle("BYBORA · Fiyat Alarmı")
                .setContentText(symbol + " · " + message)
                .setStyle(new Notification.BigTextStyle().bigText(message))
                .setContentIntent(pendingIntent)
                .setAutoCancel(true)
                .setPriority(Notification.PRIORITY_HIGH)
                .build();

        int notificationId = (int) (System.currentTimeMillis() & 0x7fffffff);
        manager.notify(notificationId, notification);
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if (requestCode == REQUEST_POST_NOTIFICATIONS && webView != null) {
            webView.post(() -> webView.evaluateJavascript(
                    "window.byBoraAlertPermissionChanged && window.byBoraAlertPermissionChanged()", null));
        }
    }

    private android.webkit.WebResourceResponse proxyMarketDataRequest(
            WebResourceRequest request) {
        Map<String, String> headers = new HashMap<>();
        headers.put("Access-Control-Allow-Origin", "*");
        headers.put("Access-Control-Allow-Methods", "GET, OPTIONS");
        headers.put("Access-Control-Allow-Headers", "Authorization, Accept, Content-Type");
        headers.put("Access-Control-Expose-Headers", "X-RateLimit-Remaining, X-Quota-Remaining, Retry-After");
        headers.put("Access-Control-Max-Age", "600");
        headers.put("Cache-Control", "no-store");

        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            return new android.webkit.WebResourceResponse(
                    "application/json", "UTF-8", 204, "No Content",
                    headers, new ByteArrayInputStream(new byte[0]));
        }

        HttpURLConnection connection = null;
        try {
            connection = (HttpURLConnection) new URL(request.getUrl().toString()).openConnection();
            connection.setRequestMethod("GET");
            connection.setConnectTimeout(12000);
            connection.setReadTimeout(20000);
            connection.setUseCaches(false);
            String requestHost = request.getUrl().getHost();
            connection.setRequestProperty("Accept", "stockanalysis.com".equalsIgnoreCase(requestHost)
                    ? "text/html,application/xhtml+xml,application/json;q=0.9,*/*;q=0.8"
                    : "application/json");
            connection.setRequestProperty("Accept-Encoding", "identity");
            connection.setRequestProperty("User-Agent", "Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 Chrome/126.0 Mobile Safari/537.36");
            connection.setRequestProperty("Referer", "https://finance.yahoo.com/");
            connection.setRequestProperty("Accept-Language", "tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7");

            Map<String, String> requestHeaders = request.getRequestHeaders();
            String authorization = requestHeaders.get("Authorization");
            if (authorization == null) authorization = requestHeaders.get("authorization");
            if (authorization != null && !authorization.trim().isEmpty()) {
                connection.setRequestProperty("Authorization", authorization);
            }

            int status = connection.getResponseCode();
            InputStream responseStream = status >= 400 ?
                    connection.getErrorStream() : connection.getInputStream();
            if (responseStream == null) responseStream = new ByteArrayInputStream(new byte[0]);

            final HttpURLConnection activeConnection = connection;
            InputStream safeStream = new FilterInputStream(responseStream) {
                @Override
                public void close() throws IOException {
                    try {
                        super.close();
                    } finally {
                        activeConnection.disconnect();
                    }
                }
            };

            String reason = connection.getResponseMessage();
            if (reason == null || reason.isEmpty()) reason = status >= 400 ? "Upstream Error" : "OK";

            return new android.webkit.WebResourceResponse(
                    "application/json", "UTF-8", status, reason, headers, safeStream);
        } catch (Exception exception) {
            if (connection != null) connection.disconnect();
            String message = "{\"error\":{\"message\":\"Market data connection failed\"}}";
            return new android.webkit.WebResourceResponse(
                    "application/json", "UTF-8", 502, "Bad Gateway", headers,
                    new ByteArrayInputStream(message.getBytes(StandardCharsets.UTF_8)));
        }
    }

    private void openExternal(Uri uri) {
        try {
            Intent intent = new Intent(Intent.ACTION_VIEW, uri);
            startActivity(intent);
        } catch (ActivityNotFoundException exception) {
            Toast.makeText(this, "Bu bağlantıyı açacak uygulama bulunamadı.",
                    Toast.LENGTH_SHORT).show();
        }
    }


    private void beginSaveWatchlistFile(String json) {
        pendingWatchlistJson = json == null ? "{}" : json;
        Intent intent = new Intent(Intent.ACTION_CREATE_DOCUMENT);
        intent.addCategory(Intent.CATEGORY_OPENABLE);
        intent.setType("application/json");
        intent.putExtra(Intent.EXTRA_TITLE, "BYBORA-izleme-listesi.json");
        try {
            startActivityForResult(intent, REQUEST_SAVE_WATCHLIST);
        } catch (ActivityNotFoundException exception) {
            pendingWatchlistJson = null;
            Toast.makeText(this, "Dosya kaydetme ekranı açılamadı.", Toast.LENGTH_SHORT).show();
        }
    }

    private void beginOpenWatchlistFile() {
        Intent intent = new Intent(Intent.ACTION_OPEN_DOCUMENT);
        intent.addCategory(Intent.CATEGORY_OPENABLE);
        intent.setType("application/json");
        intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
        try {
            startActivityForResult(intent, REQUEST_OPEN_WATCHLIST);
        } catch (ActivityNotFoundException exception) {
            Toast.makeText(this, "Dosya seçme ekranı açılamadı.", Toast.LENGTH_SHORT).show();
        }
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (resultCode != RESULT_OK || data == null || data.getData() == null) {
            pendingWatchlistJson = null;
            return;
        }
        Uri uri = data.getData();
        if (requestCode == REQUEST_SAVE_WATCHLIST) {
            String content = pendingWatchlistJson;
            pendingWatchlistJson = null;
            if (content == null) return;
            try (OutputStream output = getContentResolver().openOutputStream(uri, "wt")) {
                if (output == null) throw new IOException("Dosya yazma akışı açılamadı.");
                output.write(content.getBytes(StandardCharsets.UTF_8));
                output.flush();
                Toast.makeText(this, "İzleme listesi JSON dosyasına kaydedildi.", Toast.LENGTH_LONG).show();
            } catch (Exception exception) {
                Toast.makeText(this, "İzleme listesi kaydedilemedi.", Toast.LENGTH_LONG).show();
            }
        } else if (requestCode == REQUEST_OPEN_WATCHLIST) {
            try (InputStream input = getContentResolver().openInputStream(uri);
                 ByteArrayOutputStream output = new ByteArrayOutputStream()) {
                if (input == null) throw new IOException("Dosya okunamadı.");
                byte[] buffer = new byte[8192];
                int count;
                while ((count = input.read(buffer)) != -1) {
                    output.write(buffer, 0, count);
                    if (output.size() > 5 * 1024 * 1024) throw new IOException("Dosya çok büyük.");
                }
                String json = output.toString(StandardCharsets.UTF_8.name());
                if (webView != null) {
                    webView.evaluateJavascript(
                            "window.handleWatchlistImport && window.handleWatchlistImport(" + JSONObject.quote(json) + ")",
                            null);
                }
            } catch (Exception exception) {
                Toast.makeText(this, "İzleme listesi dosyası okunamadı.", Toast.LENGTH_LONG).show();
            }
        }
    }

    @Override
    public void onBackPressed() {
        if (webView != null && webView.canGoBack()) {
            webView.goBack();
        } else {
            super.onBackPressed();
        }
    }

    @Override
    protected void onDestroy() {
        if (webView != null) {
            webView.stopLoading();
            webView.setWebChromeClient(null);
            webView.setWebViewClient(null);
            webView.destroy();
            webView = null;
        }
        super.onDestroy();
    }
}
