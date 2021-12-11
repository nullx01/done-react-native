package com.donereactnative;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import android.widget.Toast;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.BaseActivityEventListener;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.io.FileNotFoundException;
import java.io.OutputStream;
import java.io.PrintStream;
import java.io.PrintWriter;

public class ExportModule extends ReactContextBaseJavaModule {

    private static final int CREATE_DOCUMENT_REQUEST = 1;

    private static final String E_ACTIVITY_DOES_NOT_EXIST = "E_ACTIVITY_DOES_NOT_EXIST";

    private static final String E_FAILED_TO_SHOW_ACTION = "E_FAILED_TO_SHOW_ACTION";

    private static final String E_ACTION_CANCELED = "E_ACTION_CANCELED";

    private static final String E_DOCUMENT_URI_MISSING = "E_DOCUMENT_URI_MISSING";

    private static final String E_FILE_NOT_FOUND = "E_FILE_NOT_FOUND";

    private final ActivityEventListener listener = new BaseActivityEventListener() {
        @Override
        public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
            if (requestCode == CREATE_DOCUMENT_REQUEST) {
                if (resultCode != Activity.RESULT_OK) {
                    reject(exportPromise, E_ACTION_CANCELED, "Document creation was canceled");
                } else {
                    Uri uri = data.getData();

                    if (uri == null) {
                        reject(exportPromise, E_DOCUMENT_URI_MISSING, "Document URI for export is missing");
                    } else {
                        try {
                            OutputStream outputStream = getReactApplicationContext().getContentResolver().openOutputStream(uri);
                            PrintStream writer = new PrintStream(outputStream);
                            writer.print(exportData);
                            resolve(exportPromise, null);
                        } catch (FileNotFoundException e) {
                            reject(exportPromise, E_FILE_NOT_FOUND, e);
                        }
                    }
                }

                // Clear the properties in any case
                exportPromise = null;
                exportData = null;
            }
        }

        private void reject(Promise promise, String code, String message) {
            if (promise != null) {
                promise.reject(code, message);
            }
        }

        private void reject(Promise promise, String code, Throwable throwable) {
            if (promise != null) {
                promise.reject(code, throwable);
            }
        }

        private void resolve(Promise promise, Object value) {
            if (promise != null) {
                promise.resolve(value);
            }
        }
    };

    private Promise exportPromise;

    private String exportData;

    ExportModule(ReactApplicationContext context) {
        super(context);

        context.addActivityEventListener(listener);
    }

    @ReactMethod
    public void exportJsonFile(String filename, String data, Promise promise) {
        Activity currentActivity = getCurrentActivity();
        if (currentActivity == null) {
            promise.reject(E_ACTIVITY_DOES_NOT_EXIST, "Activity does not exist");
            return;
        }

        Intent intent = new Intent(Intent.ACTION_CREATE_DOCUMENT);
        intent.addCategory(Intent.CATEGORY_OPENABLE);
        intent.putExtra(Intent.EXTRA_TITLE, filename);
        intent.setType("text/json");

        try {
            exportPromise = promise;
            exportData = data;
            currentActivity.startActivityForResult(intent, CREATE_DOCUMENT_REQUEST);
        } catch (Exception e) {
            exportPromise = null;
            exportData = null;
            promise.reject(E_FAILED_TO_SHOW_ACTION, e);
            return;
        }
    }

    @NonNull
    @Override
    public String getName() {
        return "ExportModule";
    }
}
