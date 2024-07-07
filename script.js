$(document).ready(function () {
  // Reset location hash
  if (window.location.hash) {
    window.location.hash = "";
  }
  // ini untuk ajax mengambil data dari paket.json lalu ditampilkan
  $.ajax({
    url: "https://AriMahfudho.github.io/Landing-Page/paket.json",
    type: "GET",
    dataType: "json",
    success: (data) => {
      var productsListHtml = "";
      $.each(data.products, (index, products) => {
        productsListHtml +=
          '<li class="card">' +
          '<div class="img"><img src="' +
          products.image +
          '" alt="img" draggable="false" /></div>' +
          "<h2>" +
          products.name +
          "</h2>" +
          '<p class="deskripsi">' +
          "</li>";
      });
      $(".carousel").html(productsListHtml);
      swipe();
    },
    error: (xhr, status, error) => {
      console.error(error);
    },
  });
});

// Function on mini display
const toggleMenu = () => {
  var menu = $("#navbar-menu");
  var toggleButton = $(".navbar-toggle");
  menu.toggleClass("active");
  toggleButton.toggleClass("active");
};

// Function swipe
const swipe = () => {
  // Seleksi elemen-elemen jQuery yang diperlukan
  const buttonSelection = $(".button-selection"); // buttonSelection carousel
  const carousel = $(".carousel"); // Kontainer carousel
  const firstCardWidth = $(".carousel .card").outerWidth(); // Lebar kartu pertama dalam carousel
  const arrowBtns = $(".button-selection i"); // Tombol panah kiri dan kanan
  const carouselChildrens = carousel.children(); // Anak-anak dari carousel

  // Variabel untuk menandai status drag dan autoplay
  let isDragging = false,
    isAutoPlay = true,
    startX,
    startScrollLeft,
    timeoutId;

  // Mendapatkan jumlah kartu yang dapat ditampilkan dalam carousel sekaligus
  let cardPerView = Math.round(carousel.outerWidth() / firstCardWidth);

  // Menyisipkan salinan kartu terakhir ke awal carousel untuk infinite scrolling
  carouselChildrens.slice(-cardPerView).clone().prependTo(carousel);

  // Menyisipkan salinan kartu pertama ke akhir carousel untuk infinite scrolling
  carouselChildrens.slice(0, cardPerView).clone().appendTo(carousel);

  // Menggeser carousel ke posisi yang tepat untuk menyembunyikan beberapa kartu duplikat pertama pada Firefox
  carousel.addClass("no-transition");
  carousel.scrollLeft(carousel.outerWidth());
  carousel.removeClass("no-transition");

  // Menambahkan event listener untuk tombol panah untuk menggeser carousel ke kiri dan kanan
  arrowBtns.on("click", function () {
    carousel.scrollLeft(
      carousel.scrollLeft() +
        ($(this).attr("id") === "left" ? -firstCardWidth : firstCardWidth)
    );
  });
  // Fungsi untuk memulai drag
  const dragStart = (e) => {
    isDragging = true;
    carousel.addClass("dragging");
    // Merekam posisi kursor awal dan posisi scroll awal carousel
    startX = e.pageX;
    startScrollLeft = carousel.scrollLeft();
  };

  // Fungsi untuk menangani peristiwa dragging
  const dragging = (e) => {
    if (!isDragging) return; // Jika isDragging adalah false, keluar dari fungsi
    // Memperbarui posisi scroll carousel berdasarkan pergerakan kursor
    carousel.scrollLeft(startScrollLeft - (e.pageX - startX));
  };

  // Fungsi untuk menghentikan drag
  const dragStop = () => {
    isDragging = false;
    carousel.removeClass("dragging");
  };

  // Fungsi untuk infinite scrolling
  const infiniteScroll = () => {
    // Jika carousel berada di awal, geser ke akhir
    if (carousel.scrollLeft() === 0) {
      carousel
        .addClass("no-transition")
        .scrollLeft(carousel[0].scrollWidth - 2 * carousel.outerWidth())
        .removeClass("no-transition");
    }
    // Jika carousel berada di akhir, geser ke awal
    else if (
      Math.ceil(carousel.scrollLeft()) ===
      carousel[0].scrollWidth - carousel.outerWidth()
    ) {
      carousel
        .addClass("no-transition")
        .scrollLeft(carousel.outerWidth())
        .removeClass("no-transition");
    }

    // Hapus timeout yang ada & mulai autoplay jika mouse tidak berada di atas carousel
    clearTimeout(timeoutId);
    if (!buttonSelection.is(":hover")) autoPlay();
  };

  // Fungsi untuk autoplay
  const autoPlay = () => {
    if (window.innerWidth < 800 || !isAutoPlay) return; // Keluar jika lebar window lebih kecil dari 800 atau isAutoPlay adalah false
    // Autoplay carousel setiap 2500 ms
    timeoutId = setTimeout(
      () => carousel.scrollLeft(carousel.scrollLeft() + firstCardWidth),
      1500
    );
  };
  autoPlay();

  // Menambahkan event listener untuk mousedown, mousemove, mouseup, scroll, mouseenter, dan mouseleave
  carousel.on("mousedown", dragStart);
  carousel.on("mousemove", dragging);
  $(document).on("mouseup", dragStop);
  carousel.on("scroll", infiniteScroll);
  buttonSelection.on("mouseenter", () => clearTimeout(timeoutId));
  buttonSelection.on("mouseleave", autoPlay);

};