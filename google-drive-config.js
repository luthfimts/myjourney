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
// PULIHKAN TOKEN GOOGLE DARI SESSION STORAGE
// ======================================================

function pulihkankanTokenGoogle(){
    const tokenTersimpan =
        sessionStorage.getItem(
            "googleDriveAccessToken"
        );

    const expiresTersimpan =
        Number(
            sessionStorage.getItem(
                "googleDriveTokenExpiresAt"
            )
        );

    if (
        tokenTersimpan &&
        expiresTersimpan &&
        Date.now() < expiresTersimpan
    ){
        googleAccessToken =
            tokenTersimpan;

        
            googleTokenExpiresAt =

        console.log(
            "Session Google Drive dipulihkan✅"
        );

        return true;
    }

    sessionStorage.removeItem(
        "googleDriveTokenExpiresAt"
    );

    return false;
}

// Jalankan langsung saat file JS dimuat
pulihkankanTokenGoogle();



// ======================================================
// 3. INISIALISASI GOOGLE OAUTH
// ======================================================

function initGoogleDriveAuth() {

    if (
        typeof google === "undefined" ||
        !google.accounts ||
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
                    // JIKA OAUTH ERROR
                    // ==================================

                    if (
                        response.error
                    ) {

                        const error =
                            new Error(

                                response.error_description
                                ||
                                response.error
                                ||
                                "Google OAuth gagal."

                            );


                        console.error(
                            "Google OAuth Error:",
                            response
                        );


                        selesaikanPermintaanToken(
                            null,
                            error
                        );


                        return;
                    }



                    // ==================================
                    // ACCESS TOKEN HARUS ADA
                    // ==================================

                    if (
                        !response.access_token
                    ) {

                        const error =
                            new Error(

                                "Google tidak memberikan access token."

                            );


                        console.error(
                            error
                        );


                        selesaikanPermintaanToken(
                            null,
                            error
                        );


                        return;
                    }



                    // ==================================
                    // CEK SCOPE DRIVE.FILE
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

                        const error =
                            new Error(

                                "Izin Google Drive belum diberikan."

                            );


                        console.error(
                            error
                        );


                        selesaikanPermintaanToken(
                            null,
                            error
                        );


                        return;
                    }



                    // ==================================
                    // SIMPAN TOKEN
                    // ==================================

                    googleAccessToken =
                        response.access_token;


                    const expiresIn =
                        Number(
                            response.expires_in
                        )
                        ||
                        3600;


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


// ======================================
// SIMPAN TOKEN KE SESSION STORAGE
// ======================================

    sessionStorage.setItem (
        "googleDriveAccessToken",
        String(
            googleTokenExpiresAt
        )
    );

    sessionStorage.setItem(
        "googleDriveTokenExpiresAt",
        String(
            googleTokenExpiresAt
        )
    );

      console.log(
    "Google Drive OAuth berhasil ✅"
   );


   selesaikanPermintaanToken(

       googleAccessToken,

                        null

                    );

                }

        });


    console.log(
        "Google OAuth siap ✅"
    );

}



// ======================================================
// 4. SELESAIKAN REQUEST TOKEN
// ======================================================

function selesaikanPermintaanToken(
    token,
    error
) {

    if (
        error
        &&
        googleTokenReject
    ) {

        googleTokenReject(
            error
        );

    }

    else if (
        token
        &&
        googleTokenResolve
    ) {

        googleTokenResolve(
            token
        );

    }


    googleTokenResolve =
        null;


    googleTokenReject =
        null;

}



// ======================================================
// 5. CEK TOKEN
// ======================================================

function tokenGoogleMasihValid() {

    return Boolean(

        googleAccessToken

        &&

        Date.now()
        <
        googleTokenExpiresAt

    );

}



// ======================================================
// 6. RESET TOKEN
// ======================================================

function resetTokenGoogle() {

    googleAccessToken =
        null;


    googleTokenExpiresAt =
        0;

    googleFolderId =
        null;
    
        sessionStorage.removeItem(
            "googleDriveAccessToken"
        );

        sessionStorage.removeItem(
            "googleDriveTokenExpiresAt"
        );

        console.log(
            "Session Google Drive dihapus"
        )

}



// ======================================================
// 7. MINTA ACCESS TOKEN
// ======================================================

function mintaAccessTokenGoogle(
    promptMode = ""
) {

    if (
        !googleTokenClient
    ) {

        initGoogleDriveAuth();

    }


    if (
        !googleTokenClient
    ) {

        return Promise.reject(

            new Error(

                "Google OAuth belum siap. "
                +
                "Refresh halaman lalu coba lagi."

            )

        );

    }


    return new Promise(

        function(resolve, reject) {


            googleTokenResolve =
                resolve;


            googleTokenReject =
                reject;


            googleTokenClient
                .requestAccessToken({

                    prompt:
                        promptMode

                });

        }

    );

}



// ======================================================
// 8. PASTIKAN GOOGLE DRIVE TERHUBUNG
// ======================================================

async function pastikanGoogleDriveTerhubung() {

    if (
        tokenGoogleMasihValid()
    ) {

        return googleAccessToken;

    }


    return await mintaAccessTokenGoogle(
        ""
    );

}



// ======================================================
// 9. HUBUNGKAN GOOGLE DRIVE MANUAL
// ======================================================

async function hubungkanGoogleDrive() {

    try {


        await mintaAccessTokenGoogle(
            "consent"
        );


        alert(
            "Google Drive berhasil terhubung! ✅"
        );


    }

    catch(error) {


        console.error(
            error
        );


        alert(

            "Gagal menghubungkan Google Drive.\n\n"

            +

            error.message

        );

    }

}



// ======================================================
// 10. CARI FOLDER MYJOURNEY
// ======================================================

async function cariFolderMyJourney() {


    await pastikanGoogleDriveTerhubung();


    const query =

        "name = '"

        +

        GOOGLE_FOLDER_NAME

        +

        "' and mimeType = "

        +

        "'application/vnd.google-apps.folder'"

        +

        " and trashed = false";



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

                    Authorization:
                        `Bearer ${googleAccessToken}`

                }

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
            "Silakan coba lagi."

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

            "Gagal mencari folder MyJourney."

        );

    }



    // ==========================================
    // FOLDER DITEMUKAN
    // ==========================================

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


        return googleFolderId;

    }



    return null;

}



// ======================================================
// 11. BUAT FOLDER BARU MYJOURNEY
// ======================================================

async function buatFolderBaruMyJourney() {


    await pastikanGoogleDriveTerhubung();


    const response =
        await fetch(

            "https://www.googleapis.com/drive/v3/files?fields=id,name",

            {

                method:
                    "POST",

                headers: {

                    Authorization:
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



    if (
        response.status === 401
    ) {

        resetTokenGoogle();


        throw new Error(

            "Access Token Google sudah tidak valid. "
            +
            "Silakan coba lagi."

        );

    }



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



    googleFolderId =
        data.id;


    console.log(
        "Folder MyJourney berhasil dibuat ✅"
    );


    return googleFolderId;

}



// ======================================================
// 12. PASTIKAN FOLDER MYJOURNEY ADA
// ======================================================

async function pastikanFolderMyJourney(
    tampilkanPesan = false
) {

    try {


        // ======================================
        // ID SUDAH ADA DI MEMORY
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
        // BUAT FOLDER JIKA BELUM ADA
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
// 13. TOMBOL BUAT / CARI FOLDER
// ======================================================

async function buatFolderMyJourney() {

    await pastikanFolderMyJourney(
        true
    );

}



// ======================================================
// 14. NAMA FILE AMAN
// ======================================================

function buatNamaFileDrive(
    file
) {

    let namaAsli =
        file.name
        ||
        "foto.jpg";


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
// 15. UPLOAD FILE KE GOOGLE DRIVE
// RESUMABLE UPLOAD
// ======================================================

async function uploadFileKeGoogleDrive(
    file
) {


    if (
        !file
    ) {

        throw new Error(
            "File belum dipilih."
        );

    }



    // ==========================================
    // PASTIKAN GOOGLE TERHUBUNG
    // ==========================================

    await pastikanGoogleDriveTerhubung();



    // ==========================================
    // PASTIKAN FOLDER ADA
    // ==========================================

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



    // ==========================================
    // DATA FILE
    // ==========================================

    const namaFile =
        buatNamaFileDrive(
            file
        );


    const mimeType =

        file.type

        ||

        "application/octet-stream";



    const metadata = {

        name:
            namaFile,

        mimeType:
            mimeType,

        parents: [
            folderId
        ]

    };



    console.log(
        "Memulai upload:",
        namaFile
    );



    // ==========================================
    // BUAT RESUMABLE SESSION
    // ==========================================

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

                    Authorization:
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



    // ==========================================
    // TOKEN HABIS
    // ==========================================

    if (
        sessionResponse.status === 401
    ) {

        resetTokenGoogle();


        throw new Error(

            "Session Google sudah habis. "
            +
            "Silakan coba Simpan Foto lagi."

        );

    }



    // ==========================================
    // SESSION ERROR
    // ==========================================

    if (
        !sessionResponse.ok
    ) {


        let errorData =
            null;


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



    // ==========================================
    // AMBIL UPLOAD URL
    // ==========================================

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



    // ==========================================
    // UPLOAD FILE
    // ==========================================

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



    let data =
        null;


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



    // ==========================================
    // UPLOAD GAGAL
    // ==========================================

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



    console.log(
        "Upload Google Drive berhasil ✅",
        data
    );


    return data;

}

async function hubungkanGoogleDrivePermanen() {
    try {
        console.log("Memulai koneksi Google Drive permanen...");

        // Ambil session MyJourney / Supabase
        const {
            data: { session },
            error
        } = await supabaseClient.auth.getSession();

        if (error) {
            console.error(error);
            alert("Gagal membaca session MyJourney.");
            return;
        }

        if (!session || !session.access_token) {
            alert("Silakan login ke MyJourney terlebih dahulu.");
            window.location.href = "index.html";
            return;
        }

        // Hubungi Edge Function
        const response = await fetch(
            "https://lzcvejytwslglmelpdlm.supabase.co/functions/v1/google-oauth",
            {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${session.access_token}`,
                    "Content-Type": "application/json"
                }
            }
        );

        const data = await response.json();

        if (!response.ok) {
            console.error("OAuth backend error:", data);

            throw new Error(
                data?.error ||
                "Gagal memulai koneksi Google Drive."
            );
        }

        if (!data.authorization_url) {
            throw new Error(
                "URL login Google tidak diterima dari server."
            );
        }

        console.log("Mengarahkan ke Google...");

        // Pindah ke halaman izin Google
        window.location.href = data.authorization_url;

    } catch (error) {
        console.error(
            "hubungkanGoogleDrivePermanen error:",
            error
        );

        alert(
            "Gagal menghubungkan Google Drive:\n\n" +
            error.message
        );
    }
}

window.hubungkanGoogleDrivePermanen =
    hubungkanGoogleDrivePermanen;



// ======================================================
// 16. EXPORT KE WINDOW
// ======================================================

window.initGoogleDriveAuth =
    initGoogleDriveAuth;


window.hubungkanGoogleDrive =
    hubungkanGoogleDrive;


window.cariFolderMyJourney =
    cariFolderMyJourney;


window.buatFolderMyJourney =
    buatFolderMyJourney;


window.pastikanFolderMyJourney =
    pastikanFolderMyJourney;


window.pastikanGoogleDriveTerhubung =
    pastikanGoogleDriveTerhubung;


window.uploadFileKeGoogleDrive =
    uploadFileKeGoogleDrive;
