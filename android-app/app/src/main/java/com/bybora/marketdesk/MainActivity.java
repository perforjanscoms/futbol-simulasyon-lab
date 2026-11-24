package com.bybora.marketdesk;

import android.app.Activity;
import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.graphics.Color;
import android.net.Uri;
import android.os.Bundle;
import android.os.Build;
import android.view.View;
import android.view.Window;
import android.webkit.CookieManager;
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

public final class MainActivity extends Activity {
    private static final String APP_START_URL =
            "https://appassets.androidplatform.net/assets/marketdesk/index.html";
    private static final String WEBVIEW_STATE_KEY = "bybora_marketdesk_webview_state";

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
        createWebView(savedInstanceState);
    }

    private void createWebView(Bundle savedInstanceState) {
        webView = new WebView(this);
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
                return assetLoader.shouldInterceptRequest(request.getUrl());
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
                if (host != null && (host.equalsIgnoreCase("tradingview.com") ||
                        host.toLowerCase().endsWith(".tradingview.com"))) {
                    return false;
                }
                if ("https".equalsIgnoreCase(uri.getScheme()) ||
                        "http".equalsIgnoreCase(uri.getScheme()) ||
                        "mailto".equalsIgnoreCase(uri.getScheme()) ||
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

    private void openExternal(Uri uri) {
        try {
            Intent intent = new Intent(Intent.ACTION_VIEW, uri);
            startActivity(intent);
        } catch (ActivityNotFoundException exception) {
            Toast.makeText(this, "Bu bağlantıyı açacak uygulama bulunamadı.",
                    Toast.LENGTH_SHORT).show();
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
