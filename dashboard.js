// ==========================================
// CEK LOGIN SUPABASE
// ==========================================

async function cekLogin() {

    const {
        data,
        error
    } =
        await supabaseClient
            .auth
            .getSession();


    if (error) {

        console.error(
            "Gagal mengecek login:",
            error
        );

        window.location.href =
            "index.html";

        return;
    }


    if (
        !data.session
    ) {

        window.location.href =
            "index.html";

        return;
    }


    console.log(
        "User login:",
        data.session.user.email
    );

}


cekLogin();

//============== AMBIL DATA DARI PERJALANAN ===========

const daftarPerjalanan =
    JSON.parse(
        localStorage.getItem(
            "daftarPerjalanan"
        ) 
    ) || [];


// ============== TOTAL TEMPAT ===========

document.getElementById(
    "totalTempat"
).innerText =
    daftarPerjalanan.length;

// ============== TARGET PENJALANAN ==========

// Target Jumlah Tempat
const targetPerjalanan = 1000;

// Jumlah perjalanan yang sudah dilakukan
const jumlahPerjalanan =
    daftarPerjalanan.length;

// Tampilkan angka
document.getElementById(
    "goalJumlah"
).innerText =
    jumlahPerjalanan;

// Tampilkan target
document.getElementById(
    "goalTarget"
).innerText =
targetPerjalanan;

// Hitung persentase
let persentase =
(
    jumlahPerjalanan /
    targetPerjalanan
) * 100;

// Maksimal lingkaran 100%
if (persentase > 100){
    persentase = 1000;
}

// ubag isi lingkaran
document.getElementById(
    "goalCircle"
).style.background = `

    conic-gradient(
        #10b981 0% ${persentase}%,
        #e5e7eb ${persentase}% 100%
    )

`;

// ==========================================
// NORMALISASI KOTA / WILAYAH
// ==========================================

function normalisasiKota(kota) {

    if (!kota) {
        return "";
    }

    const namaKota =
        kota
            .trim()
            .toLowerCase();


    // ======================================
    // KELOMPOK BANDUNG
    // ======================================

    const wilayahBandung = [

        "bandung",
        "kota bandung",
        "kabupaten bandung",
        "bandung barat",
        "kabupaten bandung barat",

        "lembang",
        "ciwidey",
        "dago",
        "ranca upas",
        "pangalengan",
        "soreang",
        "cikole"

    ];


    if (
        wilayahBandung.includes(
            namaKota
        )
    ) {

        return "bandung";

    }


    // Jika tidak masuk kelompok tertentu,
    // gunakan nama kota aslinya

    return namaKota;

}




// ==========================================
// NORMALISASI KOTA / WILAYAH
// ==========================================

function normalisasiKota(kota) {

    if (!kota) {
        return "";
    }

    const namaKota =
        kota
            .trim()
            .toLowerCase();





    // ======================================
    // KELOMPOK SUMATERA BARAT
    // ======================================

    const wilayahSumateraBarat = [

        "Kabupaten Agam", 
        "Kabupaten Dharmasraya",
         "Kabupaten Kepulauan Mentawai", 
         "Kabupaten Lima Puluh Kota",
          "Kabupaten Padang Pariaman", 
          "Kabupaten Pasaman",
           "Kabupaten Pasaman Barat", 
           "Kabupaten Pesisir Selatan", 
           "Kabupaten Sijunjung", 
           "Kabupaten Solok", 
           "Kabupaten Solok Selatan",
            "Kabupaten Tanah Datar", 
            "Kota Bukittinggi", 
            "Kota Padang", 
            "Kota Padang Panjang",
             "Kota Pariaman",
              "Kota Payakumbuh",
               "Kota Sawahlunto", 
               "Kota Solok",

        "Bukittinggi",
        "Padang",
        "Padang Panjang",
        "Pariaman",
        "Payakumbuh",
        "Sawahlunto",
        "Solok"

    ];


    if (
        wilayahSumateraBarat.includes(
            namaKota
        )
    ) {

        return "sumatera barat";

    }


    // Jika tidak masuk kelompok tertentu,
    // gunakan nama kota aslinya

    return namaKota;

}


// ==========================================
// NORMALISASI KOTA / WILAYAH
// ==========================================

function normalisasiKota(kota) {

    if (!kota) {
        return "";
    }

    const namaKota =
        kota
            .trim()
            .toLowerCase();


    // ======================================
    // KELOMPOK SUMATRA UTARA
    // ======================================

    const wilayahSumateraUtara = [

    "Kabupaten Asahan",
     "Kabupaten Batu Bara", 
     "Kabupaten Dairi",
      "Kabupaten Deli Serdang",
       "Kabupaten Humbang Hasundutan", 
       "Kabupaten Karo",
        "Kabupaten Labuhanbatu", 
        "Kabupaten Labuhanbatu Selatan",
         "Kabupaten Labuhanbatu Utara", 
         "Kabupaten Langkat",
          "Kabupaten Mandailing Natal",
       "Kabupaten Nias",
         "Kabupaten Nias Barat",
        "Kabupaten Nias Selatan",
         "Kabupaten Nias Utara",
        "Kabupaten Padang Lawas", 
        "Kabupaten Padang Lawas Utara", 
        "Kabupaten Pakpak Bharat", 
        "Kabupaten Samosir",
         "Kabupaten Serdang Bedagai", 
         "Kabupaten Simalungun", 
         "Kabupaten Tapanuli Selatan", 
         "Kabupaten Tapanuli Tengah", 
         "Kabupaten Tapanuli Utara", 
         "Kabupaten Toba",
          "Kota Binjai", 
          "Kota Gunungsitoli", 
          "Kota Medan", 
          "Kota Padangsidimpuan",
           "Kota Pematangsiantar",
            "Kota Sibolga",
             "Kota Tanjungbalai", 
             "Kota Tebing Tinggi",

         "Binjai",
        "Gunungsitoli",
        "Medan",
        "Padangsidimpuan",
        "Pematangsiantar",
        "Sibolga",
        "Tanjungbalai",
        "Tebing Tinggi"
    ];


    if (
        wilayahSumateraUtara.includes(
            namaKota
        )
    ) {

        return "Sumatra Utara";

    }


    // Jika tidak masuk kelompok tertentu,
    // gunakan nama kota aslinya

    return namaKota;

}

function normalisasiKota(kota) {

    if (!kota) {
        return "";
    }

    const namaKota =
        kota
            .trim()
            .toLowerCase();


    // ======================================
    // KELOMPOK ACEH
    // ======================================

    const wilayahAceh = [

        "Kabupaten Aceh Barat",
       "Kabupaten Aceh Barat Daya", 
       "Kabupaten Aceh Besar", 
       "Kabupaten Aceh Jaya", 
       "Kabupaten Aceh Selatan",
       "Kabupaten Aceh Singkil", 
       "Kabupaten Aceh Tamiang", 
       "Kabupaten Aceh Tengah", 
       "Kabupaten Aceh Tenggara", 
       "Kabupaten Aceh Timur",
        "Kabupaten Aceh Utara",
         "Kabupaten Bener Meriah", 
         "Kabupaten Bireuen",
          "Kabupaten Gayo Lues", 
          "Kabupaten Nagan Raya", 
          "Kabupaten Pidie", 
          "Kabupaten Pidie Jaya",
           "Kabupaten Simeulue", 
           "Kota Banda Aceh", 
           "Kota Langsa", 
           "Kota Lhokseumawe",
            "Kota Sabang",
             "Kota Subulussalam",



        "Banda Aceh",
        "Langsa",
        "Lhokseumawe",
        "Sabang",
        "Subulussalam"
    ];


    if (
        wilayahAceh.includes(
            namaKota
        )
    ) {

        return "aceh";

    }


    // Jika tidak masuk kelompok tertentu,
    // gunakan nama kota aslinya

    return namaKota;
}
function normalisasiKota(kota) {

    if (!kota) {
        return "";
    }

    const namaKota =
        kota
            .trim()
            .toLowerCase();

    // ======================================
    // KELOMPOK RIAU
    // ======================================

    const wilayahRiau = [

       "Kabupaten Bengkalis", 
       "Kabupaten Indragiri Hilir", 
       "Kabupaten Indragiri Hulu",
        "Kabupaten Kampar",
         "Kabupaten Kepulauan Meranti",
          "Kabupaten Kuantan Singingi", 
          "Kabupaten Pelalawan",
           "Kabupaten Rokan Hilir", 
           "Kabupaten Rokan Hulu", 
           "Kabupaten Siak", 
           "Kota Dumai",
            "Kota Pekanbaru",


       "Dumai",
        "Pekanbaru"
    ];


    if (
        wilayahRiau.includes(
            namaKota
        )
    ) {

        return "riau";

    }


    // Jika tidak masuk kelompok tertentu,
    // gunakan nama kota aslinya

    return namaKota;

  // ======================================
    // KELOMPOK LAMPUNG
    // ======================================

    const wilayahLammpung = [
"Kabupaten Lampung Barat", 
"Kabupaten Lampung Selatan",
 "Kabupaten Lampung Tengah", 
 "Kabupaten Lampung Timur", 
 "Kabupaten Lampung Utara", 
 "Kabupaten Mesuji", 
 "Kabupaten Pesawaran", 
 "Kabupaten Pesisir Barat", 
 "Kabupaten Pringsewu", 
 "Kabupaten Tanggamus", 
 "Kabupaten Tulang Bawang", 
 "Kabupaten Tulang Bawang Barat", 
 "Kabupaten Way Kanan",
  "Kota Bandar Lampung", 
  "Kota Metro",

      "Bandar Lampung",
        "Metro"
    ];


    if (
        wilayahLammpung.includes(
            namaKota
        )
    ) {

        return "Lampung";

    }


    // Jika tidak masuk kelompok tertentu,
    // gunakan nama kota aslinya

    return namaKota;


        // ======================================
    // KELOMPOK BENGKULU
    // ======================================

    const wilayahBengkulu = [
"Kabupaten Bengkulu Selatan", 
"Kabupaten Bengkulu Tengah", 
"Kabupaten Bengkulu Utara",
 "Kabupaten Kaur",
  "Kabupaten Kepahiang",
   "Kabupaten Lebong",
    "Kabupaten Mukomuko", 
    "Kabupaten Rejang Lebong", 
    "Kabupaten Seluma",
     "Kota Bengkulu",

       "Bengkulu"
    ];


    if (
        wilayahBengkulu.includes(
            namaKota
        )
    ) {

        return "Bengkulu";

    }


    // Jika tidak masuk kelompok tertentu,
    // gunakan nama kota aslinya

    return namaKota;



    
    // ======================================
    // KELOMPOK SUMATERA SELATAN
    // ======================================

    const wilayahSumateraSelatan = [

  "Kabupaten Banyuasin", 
  "Kabupaten Empat Lawang",
   "Kabupaten Lahat", 
   "Kabupaten Muara Enim",
    "Kabupaten Musi Banyuasin",
     "Kabupaten Musi Rawas", 
     "Kabupaten Musi Rawas Utara",
      "Kabupaten Ogan Ilir", 
      "Kabupaten Ogan Komering Ilir",
       "Kabupaten Ogan Komering Ulu", 
       "Kabupaten Ogan Komering Ulu Selatan", 
       "Kabupaten Ogan Komering Ulu Timur",
        "Kabupaten Penukal Abab Lematang Ilir",
         "Kota Lubuklinggau",
          "Kota Pagar Alam",
           "Kota Palembang",
            "Kota Prabumulih",

       "Lubuklinggau",
        "Pagar Alam",
        "Palembang",
        "Prabumulih"
    ];


    if (
        wilayahSumateraSelatan.includes(
            namaKota
        )
    ) {

        return "Sumatera Selatan";

    }


    // Jika tidak masuk kelompok tertentu,
    // gunakan nama kota aslinya

    return namaKota;


  
    // ======================================
    // KELOMPOK BANGKA BELITUNG
    // ======================================

    const wilayahBangkaBelitung = [

 "Kabupaten Bangka", 
 "Kabupaten Bangka Barat", 
 "Kabupaten Bangka Selatan", 
 "Kabupaten Bangka Tengah",
  "Kabupaten Belitung", 
  "Kabupaten Belitung Timur",
   "Kota Pangkalpinang",

       "Pangkalpinang"
    ];


    if (
        wilayahBangkaBelitung.includes(
            namaKota
        )
    ) {

        return "BangkaBelitung";

    }


    // Jika tidak masuk kelompok tertentu,
    // gunakan nama kota aslinya

    return namaKota;

     // ======================================
    // KELOMPOK JAKARTA
    // ======================================

    const wilayahJakarta = [

"Kabupaten Administrasi Kepulauan Seribu", 
"Kota Jakarta Barat", 
"Kota  Jakarta Pusat", 
"Kota Jakarta Selatan",
 "Kota Jakarta Timur", 
 "Kota Jakarta Utara",

      "Jakarta Barat",
        "Jakarta Pusat",
        "Jakarta Selatan",
        "Jakarta Timur",
        "Jakarta Utara"
    ];


    if (
        wilayahJakarta.includes(
            namaKota
        )
    ) {

        return "Jakarta";

    }


    // Jika tidak masuk kelompok tertentu,
    // gunakan nama kota aslinya

    return namaKota;

     // ======================================
    // KELOMPOK JAWA TENGAH
    // ======================================

    const wilayahJawaTengan = [

"Kabupaten Banjarnegara", 
"Kabupaten Banyumas", 
"Kabupaten Batang", 
"Kabupaten Blora", 
"Kabupaten Boyolali",
 "Kabupaten Brebes", 
 "Kabupaten Cilacap",
  "Kabupaten Demak", 
  "Kabupaten Grobogan", 
  "Kabupaten Jepara",
   "Kabupaten Karanganyar",
    "Kabupaten Kebumen", 
    "Kabupaten Kendal", 
    "Kabupaten Klaten",
     "Kabupaten Kudus",
      "Kabupaten Magelang", 
      "Kabupaten Pati", 
      "Kabupaten Pekalongan",
       "Kabupaten Pemalang", 
       "Kabupaten Purbalingga",
        "Kabupaten Purworejo", 
        "Kabupaten Rembang", 
        "Kabupaten Semarang",
         "Kabupaten Sragen", 
         "Kabupaten Sukoharjo",
          "Kabupaten Tegal", 
          "Kabupaten Temanggung", 
          "Kabupaten Wonogiri", 
          "Kabupaten Wonosobo", 
          "Kota Magelang",
           "Kota Pekalongan",
            "Kota Salatiga",
             "Kota Semarang", 
             "Kota Surakarta",
              "Kota Tegal",

          "Magelang",
        "Pekalongan",
        "Salatiga",
        "Semarang",
        "Surakarta",
        "Tegal"
    ];


    if (
        wilayahJawaTengan.includes(
            namaKota
        )
    ) {

        return "Jawatengah";

    }


    // Jika tidak masuk kelompok tertentu,
    // gunakan nama kota aslinya

    return namaKota;



     // ======================================
    // KELOMPOK WILAYAH JAWA BARAT
    // ======================================

    const wilayahJawaBarat = [

"Kabupaten Bandung",
 "Kabupaten Bandung Barat",
  "Kabupaten Bekasi",
   "Kabupaten Bogor", 
   "Kabupaten Ciamis", 
   "Kabupaten Cianjur",
    "Kabupaten Cirebon",
     "Kabupaten Garut", 
     "Kabupaten Indramayu", 
     "Kabupaten Karawang",
      "Kabupaten Kuningan",
       "Kabupaten Majalengka",
        "Kabupaten Pangandaran", 
        "Kabupaten Purwakarta",
         "Kabupaten Subang",
          "Kabupaten Sukabumi",
           "Kabupaten Sumedang", 
           "Kabupaten Tasikmalaya", 
           "Kota Bandung", 
           "Kota Banjar",
            "Kota Bekasi",
             "Kota Bogor",
              "Kota Cimahi",
               "Kota Cirebon", 
               "Kota Depok",
                "Kota Sukabumi", 
                "Kota Tasikmalaya",

     "Bandung",
        "Banjar",
        "Bekasi",
        "Bogor",
        "Cimahi",
        "Cirebon",
        "Depok",
        "Sukabumi",
        "Tasikmalaya"
    ];


    if (
        wilayahJawaBarat.includes(
            namaKota
        )
    ) {

        return "JawaBarat";

    }

      // ======================================
    // KELOMPOK JAWA TIMUR
    // ======================================

    const wilayahJawaTimur = [

 "Kabupaten Bangkalan", 
 "Kabupaten Banyuwangi",
  "Kabupaten Blitar", 
  "Kabupaten Bojonegoro",
   "Kabupaten Bondowoso",
    "Kabupaten Gresik",
     "Kabupaten Jember", 
     "Kabupaten Jombang",
      "Kabupaten Kediri",
       "Kabupaten Lamongan",
        "Kabupaten Lumajang",
         "Kabupaten Madiun",
          "Kabupaten Magetan", 
          "Kabupaten Malang",
           "Kabupaten Mojokerto",
            "Kabupaten Nganjuk", 
            "Kabupaten Ngawi", 
            "Kabupaten Pacitan",
             "Kabupaten Pamekasan", 
             "Kabupaten Pasuruan",
              "Kabupaten Ponorogo", 
              "Kabupaten Probolinggo", 
              "Kabupaten Sampang",
               "Kabupaten Sidoarjo",
                "Kabupaten Situbondo",
                 "Kabupaten Sumenep",
                  "Kabupaten Trenggalek",
                   "Kabupaten Tuban",
                    "Kabupaten Tulungagung",
                     "Kota Batu", 
                     "Kota Blitar",
                      "Kota Kediri",
                       "Kota Madiun",
                        "Kota Malang",
                         "Kota Mojokerto",
                          "Kota Pasuruan",
                           "Kota Probolinggo", 
                           "Kota Surabaya",
,

          "Batu",
        "Blitar",
        "Kediri",
        "Madiun",
        "Malang",
        "Mojokerto",
        "Pasuruan",
        "Probolinggo",
        "Surabaya"
    ];


    if (
        wilayahJawaTimur.includes(
            namaKota
        )
    ) {

        return "Jawa Timur";

    }


    // Jika tidak masuk kelompok tertentu,
    // gunakan nama kota aslinya

    return namaKota;

    // ======================================
    // KELOMPOK NUSA TENGGARA TIMUR
    // ======================================

    const wilayahNTT = [

"Kabupaten Alor",
 "Kabupaten Belu", 
 "Kabupaten Ende", 
 "Kabupaten Flores Timur", 
 "Kabupaten Kupang",
  "Kabupaten Lembata",
   "Kabupaten Malaka",
    "Kabupaten Manggarai", 
    "Kabupaten Manggarai Barat",
     "Kabupaten Manggarai Timur", 
     "Kabupaten Nagekeo",
      "Kabupaten Ngada",
       "Kabupaten Rote Ndao",
        "Kabupaten Sabu Raijua", 
        "Kabupaten Sikka", 
        "Kabupaten Sumba Barat",
         "Kabupaten Sumba Barat Daya",
          "Kabupaten Sumba Tengah", 
          "Kabupaten Sumba Timur",
           "Kabupaten Timor Tengah Selatan",
            "Kabupaten Timor Tengah Utara", 
            "Kota Kupang",

        "Kupang"
    ];


    if (
        wilayahNTT.includes(
            namaKota
        )
    ) {

        return "NTT";

    }


    // Jika tidak masuk kelompok tertentu,
    // gunakan nama kota aslinya

    return namaKota;

    // ======================================
    // KELOMPOK KALIMANTAN SELATAN
    // ======================================

    const wilayahKALSEL = [

"Kabupaten Balangan",
 "Kabupaten Banjar", 
 "Kabupaten Barito Kuala",
  "Kabupaten Hulu Sungai Selatan", 
  "Kabupaten Hulu Sungai Tengah", 
  "Kabupaten Hulu Sungai Utara", 
  "Kabupaten Kotabaru", 
  "Kabupaten Tabalong", 
  "Kabupaten Tanah Bumbu", 
  "Kabupaten Tanah Laut", 
  "Kabupaten Tapin", 
  "Kota Banjarbaru", 
  "Kota Banjarmasin",

         "Banjarbaru",
        "Banjarmasin"
    ];


    if (
        wilayahKALSEL.includes(
            namaKota
        )
    ) {

        return "KALIMANTAN SELATAN";

    }


    // Jika tidak masuk kelompok tertentu,
    // gunakan nama kota aslinya

    return namaKota;




    // ======================================
    // KELOMPOK KALIMANTAN TENGAH
    // ======================================

    const wilayahKALTENG = [

"Kabupaten Barito Selatan",
 "Kabupaten Barito Timur", 
 "Kabupaten Barito Utara",
  "Kabupaten Gunung Mas",
   "Kabupaten Kapuas", 
   "Kabupaten Katingan", 
   "Kabupaten Kotawaringin Barat",
    "Kabupaten Kotawaringin Timur",
     "Kabupaten Lamandau", 
     "Kabupaten Murung Raya",
      "Kabupaten Pulang Pisau", 
      "Kabupaten Seruyan", 
      "Kabupaten Sukamara",
       "Kota Palangka Raya",

         "Palangka Raya"
    ];


    if (
        wilayahKALTENG.includes(
            namaKota
        )
    ) {

        return "KALIMANTAN TENGAH";

    }


    // Jika tidak masuk kelompok tertentu,
    // gunakan nama kota aslinya

    return namaKota;





    // ======================================
    // KELOMPOK KALIMANTAN BARAT
    // ======================================

    const wilayahKALBAR = [

"Kabupaten Bengkayang", 
"Kabupaten Kapuas Hulu",
 "Kabupaten Kayong Utara", 
 "Kabupaten Ketapang", 
 "Kabupaten Kubu Raya", 
 "Kabupaten Landak",
  "Kabupaten Melawi", 
  "Kabupaten Mempawah", 
  "Kabupaten Sambas",
   "Kabupaten Sanggau",
    "Kabupaten Sekadau", 
    "Kabupaten Sintang", 
    "Kota Pontianak", 
    "Kota Singkawang",


         "Pontianak",
        "Singkawang"
    ];


    if (
        wilayahKALBAR.includes(
            namaKota
        )
    ) {

        return "KALIMANTAN BARAT";

    }


    // Jika tidak masuk kelompok tertentu,
    // gunakan nama kota aslinya

    return namaKota;



     // ======================================
    // KELOMPOK SULAWESI SELATAN
    // ======================================

    const wilayahSULAWESELATAN = [

"Kabupaten Bantaeng", 
"Kabupaten Barru",
 "Kabupaten Bone",
  "Kabupaten Bulukumba", 
  "Kabupaten Enrekang",
   "Kabupaten Gowa", 
   "Kabupaten Jeneponto",
    "Kabupaten Kepulauan Selayar", 
    "Kabupaten Luwu",
     "Kabupaten Luwu Timur",
      "Kabupaten Luwu Utara",
       "Kabupaten Maros",
        "Kabupaten Pangkajene dan Kepulauan",
         "Kabupaten Pinrang",
          "Kabupaten Sidenreng Rappang",
           "Kabupaten Sinjai",
            "Kabupaten Soppeng", 
            "Kabupaten Takalar", 
            "Kabupaten Tana Toraja",
             "Kabupaten Toraja Utara",
              "Kabupaten Wajo",
               "Kota Makassar", 
               "Kota Palopo",
                "Kota Parepare",

   "Makassar",
        "Palopo",
        "Parepare"
    ];


    if (
        wilayahSULAWESELATAN.includes(
            namaKota
        )
    ) {

        return "SULAWESI SELATAN";

    }


    // Jika tidak masuk kelompok tertentu,
    // gunakan nama kota aslinya


 // ======================================
    // KELOMPOK SULAWESI BARAT
    // ======================================

    const wilayahSULAWESIBARAT = [

"Kabupaten Majene",
 "Kabupaten Mamasa", 
 "Kabupaten Mamuju",
  "Kabupaten Mamuju Tengah",
   "Kabupaten Pasangkayu", 
   "Kabupaten Polewali Mandar",

        "Sulawesi Barat"
    ];


    if (
        wilayahGORONTALO.includes(
            namaKota
        )
    ) {

        return "GORONTALO";

    }


    // Jika tidak masuk kelompok tertentu,


     // ======================================
    // KELOMPOK PAPUA TENGAH
    // ======================================

    const wilayahPAPUATENGAH = [
"Kabupaten Deiyai", 
"Kabupaten Dogiyai", 
"Kabupaten Intan Jaya",
 "Kabupaten Mimika", 
 "Kabupaten Nabire", 
 "Kabupaten Paniai", 
 "Kabupaten Puncak", 
 "Kabupaten Puncak Jaya",

    "Papua Tengah"
    ];


    if (
        wilayahPAPUATENGAH.includes(
            namaKota
        )
    ) {

        return "PAPUA TENGAH";

    }

     // ======================================
    // KELOMPOK PAPUA PEGUNUNGAN
    // ======================================

    const wilayahPAPUAPEGUNUNGAN = [
"Kabupaten Jayawijaya", 
    "Kabupaten Lanny Jaya",
     "Kabupaten Mamberamo Tengah", 
     "Kabupaten Nduga", 
     "Kabupaten Pegunungan Bintang",
      "Kabupaten Tolikara", 
      "Kabupaten Yahukimo", 
      "Kabupaten Yalimo",

    "Papua Pegunungan"
    ];


    if (
        wilayahPAPUAPEGUNUNGAN.includes(
            namaKota
        )
    ) {

        return "PAPUA PENGUNUNGAN";

    }


















     // ======================================
    // KELOMPOK PAPUA SELATAN
    // ======================================

    const wilayahPAPUASELATAN = [
"Kabupaten Asmat", 
"Kabupaten Boven Digoel", 
"Kabupaten Mappi",
 "Kabupaten Merauke",

   "Papua Selatan"
    ];


    if (
        wilayahPAPUASELATAN.includes(
            namaKota
        )
    ) {

        return "PAPUA SELATAN";

    }


    // Jika tidak masuk kelompok tertentu,











 // ======================================
    // KELOMPOK PAPUA
    // ======================================

    const wilayahPAPUA = [
"Kabupaten Biak Numfor", 
"Kabupaten Jayapura",
 "Kabupaten Keerom", 
 "Kabupaten Kepulauan Yapen",
  "Kabupaten Mamberamo Raya", 
  "Kabupaten Sarmi",
   "Kabupaten Supiori", 
   "Kabupaten Waropen", 
   "Kota Jayapura",

 "Jayapura"
    ];


    if (
        wilayahPAPUA.includes(
            namaKota
        )
    ) {

        return "PAPUA";

    }


    // Jika tidak masuk kelompok tertentu,













    // ======================================
    // KELOMPOK PAPUA BARAT DAYA
    // ======================================

    const wilayahPAPUABARATDAYA = [
"Kabupaten Maybrat",
 "Kabupaten Raja Ampat",
  "Kabupaten Sorong",
   "Kabupaten Sorong Selatan",
    "Kabupaten Tambrauw",
     "Kota Sorong",
 
  "Sorong"
    ];


    if (
        wilayahPAPUABARATDAYA.includes(
            namaKota
        )
    ) {

        return "PAPUA BARAT DAYA";

    }


    // Jika tidak masuk kelompok tertentu,



    // ======================================
    // KELOMPOK PAPUA BARAT
    // ======================================

    const wilayahPAPUABARAT = [

"Kabupaten Fakfak", 
"Kabupaten Kaimana",
 "Kabupaten Manokwari",
  "Kabupaten Manokwari Selatan",
   "Kabupaten Pegunungan Arfak",
    "Kabupaten Teluk Bintuni",
     "Kabupaten Teluk Wondama",
 
 
    ];


    if (
        wilayahMALUKUUTARA.includes(
            namaKota
        )
    ) {

        return "PAPUA BARAT";

    }


    // Jika tidak masuk kelompok tertentu,


// ======================================
    // KELOMPOK MALUKU UTARA
    // ======================================

    const wilayahMALUKUUTARA = [

"Kabupaten Halmahera Barat",
 "Kabupaten Halmahera Tengah", 
 "Kabupaten Halmahera Timur",
  "Kabupaten Halmahera Selatan", 
  "Kabupaten Halmahera Utara",
   "Kabupaten Kepulauan Sula",
    "Kabupaten Pulau Morotai", 
    "Kabupaten Pulau Taliabu", 
    "Kota Ternate",
     "Kota Tidore Kepulauan",
 
 
     "Ternate",
        "Tidore Kepulauan",
    ];


    if (
        wilayahMALUKUUTARA.includes(
            namaKota
        )
    ) {

        return "MALUKU UTARA";

    }


    // Jika tidak masuk kelompok tertentu,







// ======================================
    // KELOMPOK MALUKU
    // ======================================

    const wilayahMALUKU = [

"Kabupaten Buru",
 "Kabupaten Buru Selatan",
  "Kabupaten Kepulauan Aru",
   "Kabupaten Kepulauan Tanimbar", 
   "Kabupaten Maluku Barat Daya", 
   "Kabupaten Maluku Tengah", 
   "Kabupaten Maluku Tenggara", 
   "Kabupaten Seram Bagian Barat", 
   "Kabupaten Seram Bagian Timur", 
   "Kota Ambon", 
   "Kota Tual",
 
 
    "Ambon",
        "Tual"
    ];


    if (
        wilayahMALUKU.includes(
            namaKota
        )
    ) {

        return "MALUKU";

    }


    // Jika tidak masuk kelompok tertentu,





 // ======================================
    // KELOMPOK GORONTALO
    // ======================================

    const wilayahGORONTALO = [

"Kabupaten Boalemo", 
"Kabupaten Bone Bolango", 
"Kabupaten Gorontalo",
 "Kabupaten Gorontalo Utara", 
 "Kabupaten Pohuwato",
  "Kota Gorontalo",

      "GORONTALO"
    ];


    if (
        wilayahGORONTALO.includes(
            namaKota
        )
    ) {

        return "GORONTALO";

    }


    // Jika tidak masuk kelompok tertentu,





 // ======================================
    // KELOMPOK SULAWESI TENGGARA
    // ======================================

    const wilayahSULAWESITENGGARA = [

"Kabupaten Bombana", 
"Kabupaten Buton",
 "Kabupaten Buton Selatan",
  "Kabupaten Buton Tengah", 
  "Kabupaten Buton Utara",
   "Kabupaten Kolaka", 
   "Kabupaten Kolaka Timur", 
   "Kabupaten Kolaka Utara", 
   "Kabupaten Konawe",
    "Kabupaten Konawe Kepulauan", 
    "Kabupaten Konawe Selatan",
     "Kabupaten Konawe Utara", 
     "Kabupaten Muna", 
     "Kabupaten Muna Barat",
      "Kabupaten Wakatobi", 
      "Kota Baubau",
       "Kota Kendari",

      "Baubau",
        "Kendari"
    ];


    if (
        wilayahSULAWESITENGGARA.includes(
            namaKota
        )
    ) {

        return "SULAWESI TENGGARA";

    }


    // Jika tidak masuk kelompok tertentu,
    // gunakan nama kota aslinya







 // ======================================
    // KELOMPOK SULAWESI TENGAH
    // ======================================

    const wilayahSULAWESITENGAH = [

"Kabupaten Banggai",
 "Kabupaten Banggai Kepulauan",
  "Kabupaten Banggai Laut", 
  "Kabupaten Buol",
   "Kabupaten Donggala",
    "Kabupaten Morowali", 
    "Kabupaten Morowali Utara", 
    "Kabupaten Parigi Moutong",
     "Kabupaten Poso", 
     "Kabupaten Sigi",
      "Kabupaten Tojo Una-Una", 
      "Kabupaten Tolitoli",
       "Kota Palu",

  "Palu"
    ];


    if (
        wilayahSULAWESITENGAH.includes(
            namaKota
        )
    ) {

        return "SULAWESI TENGAH";

    }


    // Jika tidak masuk kelompok tertentu,
    // gunakan nama kota aslinya



 // ======================================
    // KELOMPOK SULAWESI UTARA
    // ======================================

    const wilayahSULAWESIUTARA = [

"Kabupaten Bolaang Mongondow",
 "Kabupaten Bolaang Mongondow Selatan",
  "Kabupaten Bolaang Mongondow Timur", 
  "Kabupaten Bolaang Mongondow Utara", 
  "Kabupaten Kepulauan Sangihe", 
  "Kabupaten Kepulauan Siau Tagulandang Biaro",
  "Kabupaten Kepulauan Talaud", 
  "Kabupaten Minahasa", 
  "Kabupaten Minahasa Selatan", 
  "Kabupaten Minahasa Tenggara",
   "Kabupaten Minahasa Utara", 
   "Kota Bitung", 
   "Kota Kotamobagu", 
   "Kota Manado", 
   "Kota Tomohon",

  "Bitung",
        "Kotamobagu",
        "Manado",
        "Tomohon"
    ];


    if (
        wilayahSULAWESIUTARA.includes(
            namaKota
        )
    ) {

        return "SULAWESI UTARA";

    }


    // Jika tidak masuk kelompok tertentu,
    // gunakan nama kota aslinya

    return namaKota;





        
    // ======================================
    // KELOMPOK KALIMANTAN UTARA
    // ======================================

    const wilayahKALTU = [

"Kabupaten Bulungan", 
"Kabupaten Malinau", 
"Kabupaten Nunukan",
 "Kabupaten Tana Tidung", 
 "Kota Tarakan",

 "Tarakan"
    ];


    if (
        wilayahKALTU.includes(
            namaKota
        )
    ) {

        return "KALIMANTAN UTARA";

    }


    // Jika tidak masuk kelompok tertentu,
    // gunakan nama kota aslinya

    return namaKota;


    
    // ======================================
    // KELOMPOK KALIMANTAN TIMUR
    // ======================================

    const wilayahKALTIM = [

"Kabupaten Berau", 
"Kabupaten Kutai Barat", 
"Kabupaten Kutai Kartanegara", 
"Kabupaten Kutai Timur", 
"Kabupaten Mahakam Ulu",
 "Kabupaten Paser", 
 "Kabupaten Penajam Paser Utara",
  "Kota Balikpapan", 
  "Kota Bontang", 
  "Kota Samarinda",

            "Balikpapan",
        "Bontang",
        "Samarinda"
    ];


    if (
        wilayahKALTIM.includes(
            namaKota
        )
    ) {

        return "KALIMANTAN TIMUR";

    }


    // Jika tidak masuk kelompok tertentu,
    // gunakan nama kota aslinya

    return namaKota;


    
    // ======================================
    // KELOMPOK NUSA TENGGARA BARAT
    // ======================================

    const wilayahNTB = [

"Kabupaten Bima", 
"Kabupaten Dompu",
 "Kabupaten Lombok Barat", 
 "Kabupaten Lombok Tengah", 
 "Kabupaten Lombok Timur", 
 "Kabupaten Lombok Utara", 
 "Kabupaten Sumbawa",
  "Kabupaten Sumbawa Barat", 
  "Kota Bima",
   "Kota Mataram",

        "Bima",
        "Mataram"
    ];


    if (
        wilayahNTB.includes(
            namaKota
        )
    ) {

        return "NTB";

    }


    // Jika tidak masuk kelompok tertentu,
    // gunakan nama kota aslinya

    return namaKota;



    // ======================================
    // KELOMPOK DI BALI
    // ======================================

    const wilayahBali = [

"Kabupaten Badung",
 "Kabupaten Bangli", 
 "Kabupaten Buleleng",
  "Kabupaten Gianyar",
   "Kabupaten Jembrana",
    "Kabupaten Karangasem",
     "Kabupaten Klungkung",
      "Kabupaten Tabanan",
       "Kota Denpasar",

        "Denpasar"
    ];


    if (
        wilayahBali.includes(
            namaKota
        )
    ) {

        return "Bali";

    }


    // Jika tidak masuk kelompok tertentu,
    // gunakan nama kota aslinya

    return namaKota;








        // ======================================
    // KELOMPOK DI BANTEN
    // ======================================

    const wilayahBanten = [

"Kabupaten Lebak",
 "Kabupaten Pandeglang",
  "Kabupaten Serang",
   "Kabupaten Tangerang", 
   "Kota Cilegon",
    "Kota Serang",
     "Kota Tangerang",
      "Kota Tangerang Selatan",

         "Cilegon",
        "Serang",
        "Tangerang",
        "Tangerang Selatan"
    ];


    if (
        wilayahBanten.includes(
            namaKota
        )
    ) {

        return "Banten";

    }


    // Jika tidak masuk kelompok tertentu,
    // gunakan nama kota aslinya

    return namaKota;

      
    // ======================================
    // KELOMPOK DI YOGYAKARTA
    // ======================================

    const wilayahDIYogyakarta = [

 "Kabupaten Bantul", 
 "Kabupaten Gunungkidul", 
 "Kabupaten Kulon Progo", 
 "Kabupaten Sleman",
  "Kota Yogyakarta",

        "Yogyakarta"
    ];


    if (
        wilayahDIYogyakarta.includes(
            namaKota
        )
    ) {

        return "Yogyakarta";

    }


    // Jika tidak masuk kelompok tertentu,
    // gunakan nama kota aslinya

    return namaKota;




  
    // ======================================
    // KELOMPOK KEPULAUAN RIAU
    // ======================================

    const wilayahKepulauanRiau = [

 "Kabupaten Bintan",
  "Kabupaten Karimun",
   "Kabupaten Kepulauan Anambas",
    "Kabupaten Lingga",
     "Kabupaten Natuna", 
     "Kota Batam", 
     "Kota Tanjungpinang",

        "Batam",
        "Tanjungpinang"
    ];


    if (
        wilayahKepulauanRiau.includes(
            namaKota
        )
    ) {

        return "Riau";

    }


    // Jika tidak masuk kelompok tertentu,
    // gunakan nama kota aslinya

    return namaKota;




    // ======================================
    // KELOMPOK JAMBI
    // ======================================

    const wilayahJambi = [

      "Kabupaten Batang Hari", 
      "Kabupaten Bungo",
       "Kabupaten Kerinci", 
       "Kabupaten Merangin",
        "Kabupaten Muaro Jambi", 
        "Kabupaten Sarolangun", 
        "Kabupaten Tanjung Jabung Barat", 
        "Kabupaten Tanjung Jabung Timur",
         "Kabupaten Tebo", 
         "Kota Jambi", 
         "Kota Sungai Penuh",


       "Jambi",
        "Sungai Penuh"
    ];


    if (
        wilayahJambi.includes(
            namaKota
        )
    ) {

        return "";

    }


    // Jika tidak masuk kelompok tertentu,
    // gunakan nama kota aslinya

    return namaKota;
}




// ==========================================
// TOTAL KOTA
// ==========================================

const daftarKota =

    daftarPerjalanan

        .map(function(item) {

            return normalisasiKota(
                item.kota
            );

        })

        .filter(function(kota) {

            return kota !== "";

        });



const kotaUnik =
    new Set(
        daftarKota
    );


document
    .getElementById(
        "totalKota"
    )
    .innerText =
        kotaUnik.size;
    // ======== TOTAL PROVINSI======= 
   
const daftarProvinsi =
    daftarPerjalanan
        .map(item => item.provinsi)
        .filter(item => item && item.trim() !== "")
        .map(item => item.trim().toLowerCase());

const provinsiUnik =
    new Set(daftarProvinsi);

document.getElementById("totalProvinsi")
    .innerText = provinsiUnik.size;


    // ======== TOTAL NEGARA ===========
 const daftarNegara =
    daftarPerjalanan
        .map(item => item.negara)
        .filter(item => item && item.trim() !== "")
        .map(item => item.trim().toLowerCase());

const negaraUnik =
    new Set(daftarNegara);

document.getElementById("totalNegara")
    .innerText = negaraUnik.size;

    // ========== PERJALANAN TERBARU=======
    const journeyLis =
    document.getElementById(
        "journeyList"
    );

    if (
        daftarPerjalanan.length === 0
    ) {
     journeyList.innerHTML = `

        <div
            style="
                text-align:center;
                padding:50px 20px;
            "
        >

            <div
                style="
                    font-size:50px;
                    margin-bottom:15px;
                "
            >
                🧳
            </div>

            <h3>
                Belum ada perjalanan
            </h3>

            <p
                style="
                    color:#6b7280;
                    margin-top:10px;
                "
            >
                Tambahkan perjalanan pertamamu.
            </p>

        </div>

    `;

} else {

    // Data terbaru berada paling atas
    const sataTerbaru = [
        ...daftarPerjalanan
    ].reverse();

    // Hanya tampilkan 5 terakhir
    dataTerbaru
        .slice(0, 5)
        .forEach(function(item){

            const tanggal =
            new Date(
                item.tanggal
            );

            const tanggalIndonesia =
            tanggal.toLocaleDateString(

                "id-ID",
                {
                    day: "numeric",
                    month: "long",
                    year: "numeric"

            }
            );

  journeyList.innerHTML += `

                <div
                    class="journey-item"
                >

                    <div
                        class="journey-image"
                    >
                        📍
                    </div>


                    <div
                        class="journey-info"
                    >

                        <h4>
                            ${item.namaTempat}
                        </h4>

                        <p>
                            ${item.kota},
                            ${item.provinsi}
                        </p>

                        <p
                            class="journey-date"
                        >
                            📅
                            ${tanggalIndonesia}
                        </p>

                    </div>

                </div>

            `;

        });

}

// =================== LOGOUT ===========
function logout(){

    sessionStorage.removeItem(
        "isLoggedId"
    );

    sessionStorage.removeItem(
        "username"
    );

    window.location.href =
    "index.html"
}

// ============ PERSENTACE ========
document.getElementById(
    "goalPersen"
).innerText =
 Math.round(persentase) + "%"; 