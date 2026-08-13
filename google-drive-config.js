const GOOGLE_CLIENT_ID =
    "143061361307-628l0hi8q687ghum5f772c3g96t2t4do.apps.googleusercontent.com";

const GOOGLE_DRIVE_SCOPE =
    "https://www.googleapis.com/auth/drive.file";

let googleAccessToken = null;
let googleTokenClient = null;


// ==========================================
// INISIALISASI GOOGLE DRIVE
// ==========================================

function initGoogleDriveAuth() {

    console.log("Mencoba menginisialisasi Google Drive...");


    // Pastikan library Google sudah termuat
    if (
        typeof google === "undefined"
        ||
        !google.accounts
        ||
        !google.accounts.oauth2
    ) {

        console.error(
            "Google Identity Services belum termuat."
        );

        return;
    }


    googleTokenClient =
        google.accounts.oauth2.initTokenClient({

            client_id: GOOGLE_CLIENT_ID,

            scope: GOOGLE_DRIVE_SCOPE,

            callback: function(response) {

                console.log(
                    "Response Google:",
                    response
                );


                if (response.error) {

                    console.error(
                        "Google OAuth Error:",
                        response
                    );

                    alert(
                        "Gagal menghubungkan Google Drive.\n\n" +
                        response.error
                    );

                    return;
                }


                googleAccessToken =
                    response.access_token;


                console.log(
                    "Google Access Token berhasil diterima."
                );


                alert(
                    "Google Drive berhasil terhubung! ✅"
                );

            }

        });


    console.log(
        "Google Drive OAuth siap ✅"
    );

}



// ==========================================
// HUBUNGKAN GOOGLE DRIVE
// ==========================================

function hubungkanGoogleDrive() {

    console.log(
        "Tombol Hubungkan Google Drive diklik."
    );


    // Kalau belum siap, coba inisialisasi lagi
    if (!googleTokenClient) {

        initGoogleDriveAuth();

    }


    if (!googleTokenClient) {

        alert(
            "Google Drive belum siap.\n\n" +
            "Coba refresh halaman."
        );

        return;
    }


    googleTokenClient.requestAccessToken({

        prompt: "consent"

    });

}


// ==========================================
// PASTIKAN BISA DIPANGGIL DARI HTML
// ==========================================

window.initGoogleDriveAuth =
    initGoogleDriveAuth;

window.hubungkanGoogleDrive =
    hubungkanGoogleDrive;
