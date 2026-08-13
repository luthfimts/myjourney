// ======================================================
// GOOGLE DRIVE CONFIG - MYJOURNEY
// ======================================================


// ======================================================
// 1. KONFIGURASI
// ======================================================

// GANTI DENGAN CLIENT ID GOOGLE ANDA
const GOOGLE_CLIENT_ID =
    "143061361307-628l0hi8q687ghum5f772c3g96t2t4do.apps.googleusercontent.com";


const GOOGLE_DRIVE_SCOPE =
    "https://www.googleapis.com/auth/drive.file";


const GOOGLE_FOLDER_NAME =
    "MyJourney";



// ======================================================
// 2. VARIABEL GLOBAL
// ======================================================

let googleTokenClient = null;

let googleAccessToken = null;

let googleTokenExpiresAt = 0;

let googleFolderId = null;

let googleTokenResolve = null;

let googleTokenReject = null;


// ======================================================
// 3. INISIALISASI GOOGLE OAUTH
// ======================================================

function initGoogleDriveAuth() {

    console.log(
        "Menyiapkan Google Drive..."
    );


    // Pastikan Google Identity Services sudah dimuat
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

            client_id:
                GOOGLE_CLIENT_ID,

            scope:
                GOOGLE_DRIVE_SCOPE,


            callback:
                function(response) {


                    // ==================================
                    // JIKA LOGIN / IZIN GAGAL
                    // ==================================

                    if (
                        response.error
                    ) {

                        console.error(
                            "Google OAuth Error:",
                            response
                        );


                        alert(
                            "Gagal menghubungkan Google Drive.\n\n"
                            +
                            response.error
                        );


                        return;
                    }



                    // ==================================
                    // ACCESS TOKEN HARUS ADA
                    // ==================================

                    if (
                        !response.access_token
                    ) {

                        console.error(
                            "Access token tidak ditemukan."
                        );


                        alert(
                            "Google tidak memberikan Access Token."
                        );


                        return;
                    }



                    // ==================================
                    // CEK SCOPE
                    // ==================================

                    const scopeDiberikan =
                        google.accounts.oauth2
                            .hasGrantedAllScopes(

                                response,

                                GOOGLE_DRIVE_SCOPE

                            );


                    if (
                        !scopeDiberikan
                    ) {

                        alert(
                            "Izin Google Drive belum diberikan."
                        );


                        return;
                    }



                    // ==================================
                    // SIMPAN ACCESS TOKEN
                    // ==================================

                    googleAccessToken =
                        response.access_token;

                    if (googleTokenResolve){
                        googleTokenResolve(
                            googleAccessToken
                        );

                        googleTokenResolve =
                            null;

                        googleTokenReject =
                            null;
                    }


                    // Token biasanya mempunyai expires_in
                    const expiresIn =
                        Number(
                            response.expires_in
                        )
                        ||
                        3600;



                    // Kurangi 1 menit sebagai pengaman
                    googleTokenExpiresAt =

                        Date.now()

                        +

                        (
                            expiresIn
                            *
                            1000
                        )

                        -

                        60000;



                    console.log(
                        "Google Drive OAuth berhasil ✅"
                    );


                    console.log(
                        "Access Token tersedia:",
                        !!googleAccessToken
                    );


                    alert(
                        "Google Drive berhasil terhubung! ✅"
                    );

                }

        });


    console.log(
        "Google OAuth siap ✅"
    );

}



// ======================================================
// 4. CEK TOKEN
// ======================================================

function tokenGoogleMasihValid() {

    return (

        googleAccessToken

        &&

        Date.now()
        <
        googleTokenExpiresAt

    );

}



// ======================================================
// 5. RESET TOKEN
// ======================================================

function resetTokenGoogle() {

    googleAccessToken =
        null;


    googleTokenExpiresAt =
        0;


    console.log(
        "Access Token Google direset."
    );

}



// ======================================================
// 6. HUBUNGKAN GOOGLE DRIVE
// ======================================================

function hubungkanGoogleDrive() {


    // ==========================================
    // JIKA SUDAH TERHUBUNG
    // ==========================================

    if (
        tokenGoogleMasihValid()
    ) {

        alert(
            "Google Drive sudah terhubung! ✅"
        );

        return;
    }



    // ==========================================
    // JIKA TOKEN CLIENT BELUM SIAP
    // ==========================================

    if (
        !googleTokenClient
    ) {

        initGoogleDriveAuth();

    }



    if (
        !googleTokenClient
    ) {

        alert(
            "Google OAuth belum siap.\n\n"
            +
            "Refresh halaman lalu coba lagi."
        );

        return;
    }



    // ==========================================
    // MINTA ACCESS TOKEN
    // ==========================================

    googleTokenClient
        .requestAccessToken({

            prompt:
                "consent"

        });

}



// ======================================================
// 7. CARI FOLDER MYJOURNEY
// ======================================================

async function cariFolderMyJourney() {


    if (
        !tokenGoogleMasihValid()
    ) {

        return null;
    }



    try {


        const query =

            "name = '"
            +
            GOOGLE_FOLDER_NAME
            +
            "' "
            +
            "and mimeType = "
            +
            "'application/vnd.google-apps.folder' "
            +
            "and trashed = false";



        const url =
            new URL(

                "https://www.googleapis.com/drive/v3/files"

            );



        url.searchParams.set(
            "q",
            query
        );


        url.searchParams.set(
            "spaces",
            "drive"
        );


        url.searchParams.set(
            "fields",
            "files(id,name)"
        );


        url.searchParams.set(
            "pageSize",
            "10"
        );



        const response =
            await fetch(

                url.toString(),

                {

                    method:
                        "GET",

                    headers: {

                        "Authorization":
                            `Bearer ${googleAccessToken}`

                    }

                }

            );



        const data =
            await response.json();



        // ======================================
        // TOKEN INVALID
        // ======================================

        if (
            response.status === 401
        ) {

            resetTokenGoogle();


            throw new Error(

                "Access Token Google sudah tidak valid. "
                +
                "Hubungkan Google Drive kembali."

            );

        }



        // ======================================
        // ERROR LAIN
        // ======================================

        if (
            !response.ok
        ) {

            throw new Error(

                data
                    ?.error
                    ?.message

                ||

                "Gagal mencari folder MyJourney."

            );

        }



        // ======================================
        // FOLDER DITEMUKAN
        // ======================================

        if (

            Array.isArray(
                data.files
            )

            &&

            data.files.length > 0

        ) {


            googleFolderId =
                data.files[0].id;


            console.log(
                "Folder MyJourney ditemukan ✅"
            );


            console.log(
                "Folder ID tersedia:",
                !!googleFolderId
            );


            return googleFolderId;

        }



        // ======================================
        // BELUM ADA
        // ======================================

        console.log(
            "Folder MyJourney belum ditemukan."
        );


        return null;


    }

    catch(error) {


        console.error(
            "Cari Folder Error:",
            error
        );


        throw error;

    }

}



// ======================================================
// 8. BUAT FOLDER MYJOURNEY
// ======================================================

async function buatFolderBaruMyJourney() {


    if (
        !tokenGoogleMasihValid()
    ) {

        throw new Error(
            "Google Drive belum terhubung."
        );

    }



    const response =
        await fetch(

            "https://www.googleapis.com/drive/v3/files?fields=id,name",

            {

                method:
                    "POST",

                headers: {

                    "Authorization":
                        `Bearer ${googleAccessToken}`,

                    "Content-Type":
                        "application/json"

                },


                body:
                    JSON.stringify({

                        name:
                            GOOGLE_FOLDER_NAME,

                        mimeType:
                            "application/vnd.google-apps.folder"

                    })

            }

        );



    const data =
        await response.json();



    // ==========================================
    // TOKEN INVALID
    // ==========================================

    if (
        response.status === 401
    ) {

        resetTokenGoogle();


        throw new Error(

            "Access Token Google sudah tidak valid. "
            +
            "Hubungkan Google Drive kembali."

        );

    }



    // ==========================================
    // ERROR
    // ==========================================

    if (
        !response.ok
    ) {

        throw new Error(

            data
                ?.error
                ?.message

            ||

            "Gagal membuat folder MyJourney."

        );

    }


    // ERROR CALLBACK

    if (googleTokenReject){

        googleTokenReject(
            new Error(
                response.error
                ||
                "Google OAuth gagal."
            )
        );

        googleTokenResolve =
            null;

        googleTokenReject =
            null;
    }



    googleFolderId =
        data.id;



    console.log(
        "Folder MyJourney berhasil dibuat ✅"
    );


    console.log(
        "Folder ID tersedia:",
        !!googleFolderId
    );


    return googleFolderId;

}



// ======================================================
// 9. PASTIKAN FOLDER MYJOURNEY ADA
// ======================================================

async function pastikanFolderMyJourney(
    tampilkanPesan = true
) {


    // ==========================================
    // TOKEN HARUS VALID
    // ==========================================

    if (
        !tokenGoogleMasihValid()
    ) {

        if (
            tampilkanPesan
        ) {

            alert(

                "Google Drive belum terhubung.\n\n"

                +

                "Klik Hubungkan Google Drive terlebih dahulu."

            );

        }


        return null;

    }



    try {


        // ======================================
        // JIKA SUDAH ADA FOLDER ID DI MEMORY
        // ======================================

        if (
            googleFolderId
        ) {


            if (
                tampilkanPesan
            ) {

                alert(
                    "Folder MyJourney sudah siap digunakan! 📁✅"
                );

            }


            return googleFolderId;

        }



        // ======================================
        // CARI FOLDER
        // ======================================

        const folderDitemukan =
            await cariFolderMyJourney();



        // ======================================
        // FOLDER SUDAH ADA
        // ======================================

        if (
            folderDitemukan
        ) {


            if (
                tampilkanPesan
            ) {

                alert(

                    "Folder MyJourney sudah ada "
                    +
                    "dan siap digunakan! 📁✅"

                );

            }


            return folderDitemukan;

        }



        // ======================================
        // BELUM ADA → BUAT FOLDER
        // ======================================

        const folderBaru =
            await buatFolderBaruMyJourney();



        if (
            tampilkanPesan
        ) {

            alert(
                "Folder MyJourney berhasil dibuat! 📁✅"
            );

        }



        return folderBaru;


    }

    catch(error) {


        console.error(
            "Folder MyJourney Error:",
            error
        );


        if (
            tampilkanPesan
        ) {

            alert(

                "Gagal menyiapkan folder MyJourney.\n\n"

                +

                error.message

            );

        }


        return null;

    }

}



// ======================================================
// 10. TOMBOL BUAT / CARI FOLDER
// ======================================================

async function buatFolderMyJourney() {

    await pastikanFolderMyJourney(
        true
    );

}



// ======================================================
// 11. BUAT NAMA FILE YANG AMAN
// ======================================================

function buatNamaFileDrive(
    file
) {


    let namaAsli =
        file.name
        ||
        "foto.jpg";



    // Buang karakter yang berpotensi aneh
    namaAsli =
        namaAsli.replace(

            /[^\w.\-() ]/g,

            "_"

        );



    return (

        Date.now()

        +

        "-"

        +

        namaAsli

    );

}



// ======================================================
// 12. UPLOAD FILE KE GOOGLE DRIVE
//     RESUMABLE UPLOAD
// ======================================================

async function uploadFileKeGoogleDrive(
    file
) {


    // ==========================================
    // CEK TOKEN
    // ==========================================

    if (
        !tokenGoogleMasihValid()
    ) {

        alert(

            "Google Drive belum terhubung "
            +
            "atau session Google sudah habis.\n\n"

            +
            "Klik Hubungkan Google Drive kembali."

        );


        return null;

    }



    // ==========================================
    // CEK FILE
    // ==========================================

    if (
        !file
    ) {

        alert(
            "Pilih file terlebih dahulu."
        );


        return null;

    }



    try {


        // ======================================
        // PASTIKAN FOLDER ADA
        // ======================================

        const folderId =
            await pastikanFolderMyJourney(
                false
            );



        if (
            !folderId
        ) {

            throw new Error(

                "Folder MyJourney tidak dapat disiapkan."

            );

        }



        // ======================================
        // DATA FILE
        // ======================================

        const namaFile =
            buatNamaFileDrive(
                file
            );


        const mimeType =
            file.type
            ||
            "application/octet-stream";



        console.log(
            "Memulai upload:",
            namaFile
        );


        console.log(
            "Ukuran file:",
            file.size,
            "bytes"
        );



        // ======================================
        // METADATA FILE
        // ======================================

        const metadata = {

            name:
                namaFile,

            mimeType:
                mimeType,

            parents: [
                folderId
            ]

        };



        // ======================================
        // LANGKAH A
        // BUAT RESUMABLE SESSION
        // ======================================

        const sessionResponse =
            await fetch(

                "https://www.googleapis.com/upload/drive/v3/files"
                +
                "?uploadType=resumable"
                +
                "&fields=id,name,mimeType,size,webViewLink",

                {

                    method:
                        "POST",

                    headers: {

                        "Authorization":
                            `Bearer ${googleAccessToken}`,

                        "Content-Type":
                            "application/json; charset=UTF-8",

                        "X-Upload-Content-Type":
                            mimeType,

                        "X-Upload-Content-Length":
                            String(
                                file.size
                            )

                    },


                    body:
                        JSON.stringify(
                            metadata
                        )

                }

            );



        // ======================================
        // TOKEN INVALID
        // ======================================

        if (
            sessionResponse.status === 401
        ) {

            resetTokenGoogle();


            throw new Error(

                "Access Token Google sudah habis atau tidak valid.\n"
                +
                "Hubungkan Google Drive kembali."

            );

        }



        // ======================================
        // SESSION GAGAL
        // ======================================

        if (
            !sessionResponse.ok
        ) {


            let errorData = null;


            try {

                errorData =
                    await sessionResponse.json();

            }

            catch(error) {

                console.error(
                    error
                );

            }



            throw new Error(

                errorData
                    ?.error
                    ?.message

                ||

                (
                    "Gagal memulai upload. HTTP "
                    +
                    sessionResponse.status
                )

            );

        }



        // ======================================
        // AMBIL RESUMABLE SESSION URL
        // ======================================

        const uploadUrl =
            sessionResponse
                .headers
                .get(
                    "Location"
                );



        if (
            !uploadUrl
        ) {

            throw new Error(

                "Google Drive tidak memberikan "
                +
                "Resumable Upload URL."

            );

        }



        console.log(
            "Resumable session berhasil dibuat ✅"
        );



        // ======================================
        // LANGKAH B
        // UPLOAD ISI FILE
        // ======================================

        const uploadResponse =
            await fetch(

                uploadUrl,

                {

                    method:
                        "PUT",

                    headers: {

                        "Content-Type":
                            mimeType

                    },

                    body:
                        file

                }

            );



        // ======================================
        // HASIL UPLOAD
        // ======================================

        let data = null;


        try {

            data =
                await uploadResponse.json();

        }

        catch(error) {

            console.error(
                "Response upload bukan JSON:",
                error
            );

        }



        // ======================================
        // UPLOAD GAGAL
        // ======================================

        if (
            !uploadResponse.ok
        ) {

            throw new Error(

                data
                    ?.error
                    ?.message

                ||

                (
                    "Upload gagal. HTTP "
                    +
                    uploadResponse.status
                )

            );

        }



        // ======================================
        // BERHASIL
        // ======================================

        console.log(
            "Upload Google Drive berhasil ✅"
        );


        console.log(
            "Google File ID tersedia:",
            !!data?.id
        );


        return data;


    }

    catch(error) {


        console.error(
            "Upload Google Drive Error:",
            error
        );


        alert(

            "Upload foto gagal.\n\n"

            +

            error.message

        );


        return null;

    }

}



// ======================================================
// 13. TEST UPLOAD DRIVE
// ======================================================

async function testUploadGoogleDrive() {


    console.log(
        "Tombol Test Upload Drive diklik ✅"
    );



    // ==========================================
    // CARI INPUT
    // ==========================================

    const input =
        document.getElementById(
            "testGoogleFoto"
        );



    if (
        !input
    ) {

        alert(
            "Input testGoogleFoto tidak ditemukan."
        );


        return;

    }



    // ==========================================
    // AMBIL FILE
    // ==========================================

    const file =
        input.files?.[0];



    if (
        !file
    ) {

        alert(
            "Pilih foto terlebih dahulu."
        );


        return;

    }



    console.log(
        "File dipilih:",
        file.name
    );


    console.log(
        "Ukuran:",
        file.size,
        "bytes"
    );


    console.log(
        "Tipe:",
        file.type
    );

}

    // ==========================================
    // GOOGLE HARUS TERHUBUNG
    // ==========================================

    if (
        !tokenGoogleMasihValid()
    ) {

        alert(

            "Google Drive belum terhubung.\n\n"

            +

            "Klik Hubungkan Google Drive terlebih dahulu."

        );


        return;

    }



    // ==========================================
    // UPLOAD
    // ==========================================

    const hasil =
        await uploadFileKeGoogleDrive(
            file
        );



    // ==========================================
    // BERHASIL
    // ==========================================

    if (
        hasil
    ) {


        alert(

            "Foto berhasil diupload ke Google Drive! 📸✅\n\n"

            +

            "Nama file:\n"

            +

            hasil.name

        );


        console.log(
            "TEST UPLOAD BERHASIL:",
            hasil
        );


        // Reset input test
        input.value =
            "";

    }


    //========================================
    // PASTIKAN GOOGLE DRIVE TERHUBUNG
    //========================================

    function pastikanGoogleDriveTerhubung(){

        // Token masih aktif
        if(
            tokenGoogleMasihValid()
        ) {
            return Promise.resolve(
            googleAccessToken
            );
            
        }
       

    // Google OAuth belum siap

        if(
            !googleTokenClient
        ){
            initGoogleDriveAuth();
        }

        if (
            !googleTokenClient
        ){
            return Promise.reject(
                new Error(
                    "Google OAuth belum siap."
                )
            );
        }

        return new Promise(
            function(resolve, reject){

                googleTokenResolve =
                resolve;

                googleTokenReject =
                reject;

                googleTokenClient 
                    .requestAccessToken({

                        prompt: ""
                    });
            }
        );
    }
    
    

    

// ======================================================
// 14. EXPORT KE WINDOW
// Supaya onclick HTML dapat memanggil fungsi
// ======================================================

window.initGoogleDriveAuth =
    initGoogleDriveAuth;


window.hubungkanGoogleDrive =
    hubungkanGoogleDrive;


window.cariFolderMyJourney =
    cariFolderMyJourney;


window.buatFolderMyJourney =
    buatFolderMyJourney;


window.uploadFileKeGoogleDrive =
    uploadFileKeGoogleDrive;


window.testUploadGoogleDrive =
    testUploadGoogleDrive;

window.pastikanGoogleDriveTerhubung =
    pastikanGoogleDriveTerhubung;
