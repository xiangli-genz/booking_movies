// Menu Mobile
const buttonMenuMobile = document.querySelector(".header .inner-menu-mobile");
if(buttonMenuMobile) {
  const menu = document.querySelector(".header .inner-menu");

  // Click vào button mở menu
  buttonMenuMobile.addEventListener("click", () => {
    menu.classList.add("active");
  });

  // Click vào overlay đóng menu
  const overlay = menu.querySelector(".inner-overlay");
  if(overlay) {
    overlay.addEventListener("click", () => {
      menu.classList.remove("active");
    });
  }

  // Click vào icon down mở sub menu
  const listButtonSubMenu = menu.querySelectorAll("ul > li > i");
  listButtonSubMenu.forEach(button => {
    button.addEventListener("click", () => {
      button.parentNode.classList.toggle("active");
    })
  });
}
// End Menu Mobile

// Box Address Section 1
const boxAddressSection1 = document.querySelector(".section-1 .inner-form .inner-box.inner-address");
if(boxAddressSection1) {
  // Ẩn/hiện box suggest
  const input = boxAddressSection1.querySelector(".inner-input");

  input.addEventListener("focus", () => {
    boxAddressSection1.classList.add("active");
  })

  input.addEventListener("blur", () => {
    boxAddressSection1.classList.remove("active");
  })

  // Sự kiện click vào từng item
  const listItem = boxAddressSection1.querySelectorAll(".inner-suggest-list .inner-item");
  listItem.forEach(item => {
    item.addEventListener("mousedown", () => {
      const title = item.querySelector(".inner-item-title").innerHTML.trim();
      if(title) {
        input.value = title;
      }
    })
  })
}
// End Box Address Section 1

// Box User Section 1
const boxUserSection1 = document.querySelector(".section-1 .inner-form .inner-box.inner-user");
if(boxUserSection1) {
  // Hiện box quantity
  const input = boxUserSection1.querySelector(".inner-input");

  input.addEventListener("focus", () => {
    boxUserSection1.classList.add("active");
  })

  // Ẩn box quantity
  document.addEventListener("click", (event) => {
    // Kiểm tra nếu click không nằm trong khối `.inner-box.inner-user`
    if (!boxUserSection1.contains(event.target)) {
      boxUserSection1.classList.remove("active");
    }
  });

  // Thêm số lượng vào ô input
  const updateQuantityInput = () => {
    const listBoxNumber = boxUserSection1.querySelectorAll(".inner-count .inner-number");
    const listNumber = [];
    listBoxNumber.forEach(boxNumber => {
      const number = parseInt(boxNumber.innerHTML.trim());
      listNumber.push(number);
    })
    const value = `NL: ${listNumber[0]}, TE: ${listNumber[1]}, EB: ${listNumber[2]}`;
    input.value = value;
  }

  // Bắt sự kiện click nút up
  const listButtonUp = boxUserSection1.querySelectorAll(".inner-count .inner-up");
  listButtonUp.forEach(button => {
    button.addEventListener("click", () => {
      const parent = button.parentNode;
      const boxNumber = parent.querySelector(".inner-number");
      const number = parseInt(boxNumber.innerHTML.trim());
      const numberUpdate = number + 1;
      boxNumber.innerHTML = numberUpdate;
      updateQuantityInput();
    })
  })

  // Bắt sự kiện click nút down
  const listButtonDown = boxUserSection1.querySelectorAll(".inner-count .inner-down");
  listButtonDown.forEach(button => {
    button.addEventListener("click", () => {
      const parent = button.parentNode;
      const boxNumber = parent.querySelector(".inner-number");
      const number = parseInt(boxNumber.innerHTML.trim());
      if(number > 0) {
        const numberUpdate = number - 1;
        boxNumber.innerHTML = numberUpdate;
        updateQuantityInput();
      }
    })
  })
}
// End Box User Section 1

// Clock Expire
const clockExpire = document.querySelector("[clock-expire]");
if(clockExpire) {
  const expireDateTimeString = clockExpire.getAttribute("clock-expire");

  // Chuyển đổi chuỗi thời gian thành đối tượng Date
  const expireDateTime = new Date(expireDateTimeString);

  // Hàm cập nhật đồng hồ
  const updateClock = () => {
    const now = new Date();
    const remainingTime = expireDateTime - now; // quy về đơn vị mili giây
    
    if (remainingTime > 0) {
      const days = Math.floor(remainingTime / (24 * 60 * 60 * 1000));
      // Tính số ngày, 24 * 60 * 60 * 1000 Tích của các số này = số mili giây trong 1 ngày

      const hours = Math.floor((remainingTime / (60 * 60 * 1000)) % 24);
      // Tính số giờ, 60 * 60 * 1000 Chia remainingTime cho giá trị này để nhận được tổng số giờ.
      // % 24 Lấy phần dư khi chia tổng số giờ cho 24 để chỉ lấy số giờ còn lại trong ngày.

      const minutes = Math.floor((remainingTime / (60 * 1000)) % 60);
      // Tính số phút, 60 * 1000 Chia remainingTime cho giá trị này để nhận được tổng số phút.
      // % 60 Lấy phần dư khi chia tổng số phút cho 60 để chỉ lấy số phút còn lại trong giờ.

      const seconds = Math.floor((remainingTime / 1000) % 60);
      // Tính số giây, 1000 Chia remainingTime cho giá trị này để nhận được tổng số giây.
      // % 60 Lấy phần dư khi chia tổng số giây cho 60 để chỉ lấy số giây còn lại trong phút.

      // Cập nhật giá trị vào thẻ span
      const listBoxNumber = clockExpire.querySelectorAll('.inner-number');
      listBoxNumber[0].innerHTML = `${days}`.padStart(2, '0');
      listBoxNumber[1].innerHTML = `${hours}`.padStart(2, '0');
      listBoxNumber[2].innerHTML = `${minutes}`.padStart(2, '0');
      listBoxNumber[3].innerHTML = `${seconds}`.padStart(2, '0');
    } else {
      // Khi hết thời gian, dừng đồng hồ
      clearInterval(intervalClock);
    }
  }

  // Gọi hàm cập nhật đồng hồ mỗi giây
  const intervalClock = setInterval(updateClock, 1000);
}
// End Clock Expire

// Box Filter
const buttonFilterMobile = document.querySelector(".section-9 .inner-filter-mobile");
if(buttonFilterMobile) {
  const boxLeft = document.querySelector(".section-9 .inner-left");
  buttonFilterMobile.addEventListener("click", () => {
    boxLeft.classList.add("active");
  })

  const overlay = document.querySelector(".section-9 .inner-left .inner-overlay");
  overlay.addEventListener("click", () => {
    boxLeft.classList.remove("active");
  })
}
// End Box Filter

// Box Tour Info
const boxTourInfo = document.querySelector(".box-tour-info");
if(boxTourInfo) {
  const buttonReadMore = boxTourInfo.querySelector(".inner-read-more button");
  buttonReadMore.addEventListener("click", () => {
    boxTourInfo.classList.add("active");
  })

  new Viewer(boxTourInfo);
}
// End Box Tour Info

// Khởi tạo AOS
AOS.init();
// Hết Khởi tạo AOS

// Swiper Section 2
const swiperSection2 = document.querySelector(".swiper-section-2");
if(swiperSection2) {
  new Swiper('.swiper-section-2', {
    slidesPerView: 1,
    spaceBetween: 20,
    autoplay: {
      delay: 4000,
    },
    loop: true,
    breakpoints: {
      992: {
        slidesPerView: 2,
      },
      1200: {
        slidesPerView: 3,
      },
    },
  });
}
// End Swiper Section 2

// Swiper Section 3
const swiperSection3 = document.querySelector(".swiper-section-3");
if(swiperSection3) {
  new Swiper('.swiper-section-3', {
    slidesPerView: 1,
    spaceBetween: 20,
    autoplay: {
      delay: 4000,
    },
    loop: true,
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    breakpoints: {
      576: {
        slidesPerView: 2,
      },
      992: {
        slidesPerView: 3,
      },
    },
  });
}
// End Swiper Section 3

// Swiper Box Images
const boxImages = document.querySelector(".box-images");
if(boxImages) {
  const swiperBoxImagesThumb = new Swiper(".swiper-box-images-thumb", {
    spaceBetween: 5,
    slidesPerView: 4,
    breakpoints: {
      576: {
        spaceBetween: 10,
      },
    },
  });

  const swiperBoxImagesMain = new Swiper(".swiper-box-images-main", {
    spaceBetween: 0,
    thumbs: {
      swiper: swiperBoxImagesThumb,
    },
  });
}
// End Swiper Box Images

// Zoom Box Images Main
const boxImagesMain = document.querySelector(".box-images .inner-images-main");
if(boxImagesMain) {
  new Viewer(boxImagesMain);
}
// End Zoom Box Images Main

// Box Tour Schedule
const boxTourSchedule = document.querySelector(".box-tour-schedule");
if(boxTourSchedule) {
  new Viewer(boxTourSchedule);
}
// End Box Tour Schedule

// Email Form
const emailForm = document.querySelector("#email-form");
if(emailForm) {
  const validation = new JustValidate('#email-form');

  validation
    .addField('#email-input', [
      {
        rule: 'required',
        errorMessage: 'Vui lòng nhập email của bạn!',
      },
      {
        rule: 'email',
        errorMessage: 'Email không đúng định dạng!',
      },
    ])
    .onSuccess((event) => {
      const email = event.target.email.value;
      const dataFinal = {
        email: email,
      };
      
      fetch(`/contact/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataFinal),
      })
        .then(res => res.json())
        .then(data => {
          if(data.code == "error") {
            alert(data.message);
          }

          if(data.code == "success") {
            window.location.reload();
          }
        })
    })
  ;
}
// End Email Form

// Coupon Form
const couponForm = document.querySelector("#coupon-form");
if(couponForm) {
  const validation = new JustValidate('#coupon-form');

  validation
    .onSuccess((event) => {
      const coupon = event.target.coupon.value;
      console.log(coupon);
    })
  ;
}
// End Email Form

// Order Form
const orderForm = document.querySelector("#order-form");
if(orderForm) {
  const validation = new JustValidate('#order-form');

  validation
    .addField('#full-name-input', [
      {
        rule: 'required',
        errorMessage: 'Vui lòng nhập họ tên!'
      },
      {
        rule: 'minLength',
        value: 5,
        errorMessage: 'Họ tên phải có ít nhất 5 ký tự!',
      },
      {
        rule: 'maxLength',
        value: 50,
        errorMessage: 'Họ tên không được vượt quá 50 ký tự!',
      },
    ])
    .addField('#phone-input', [
      {
        rule: 'required',
        errorMessage: 'Vui lòng nhập số điện thoại!'
      },
      {
        rule: 'customRegexp',
        value: /(84|0[3|5|7|8|9])+([0-9]{8})\b/g,
        errorMessage: 'Số điện thoại không đúng định dạng!'
      },
    ])
    .onSuccess((event) => {
      const fullName = event.target.fullName.value;
      const phone = event.target.phone.value;
      const note = event.target.note.value;
      const method = event.target.method.value;

      let cart = JSON.parse(localStorage.getItem("cart"));
      cart = cart.filter(item => {
        return (item.checked == true) && (item.quantityAdult + item.quantityChildren + item.quantityBaby > 0)
      });

      cart = cart.map(item => {
        return {
          tourId: item.tourId,
          locationFrom: item.locationFrom,
          quantityAdult: item.quantityAdult,
          quantityChildren: item.quantityChildren,
          quantityBaby: item.quantityBaby,
        }
      })

      if(cart.length > 0) {
        const dataFinal = {
          fullName: fullName,
          phone: phone,
          note: note,
          paymentMethod: method,
          items: cart
        };

        fetch(`/order/create`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataFinal),
        })
          .then(res => res.json())
          .then(data => {
            if(data.code == "error") {
              alert(data.message);
            }
  
            if(data.code == "success") {
              // Cập nhật lại giỏ hàng
              let cart = JSON.parse(localStorage.getItem("cart"));
              cart = cart.filter(item => item.checked == false);
              localStorage.setItem("cart", JSON.stringify(cart));

              switch (method) {
                case "money":
                case "bank":

              // Chuyển hướng sang trang đặt hành thành công
              window.location.href = `/order/success?orderId=${data.orderId}&phone=${phone}`;
              break;
                case "zalopay":
                  // Chuyển hướng sang trang thanh toán bằng ZaloPay
                  window.location.href = `/order/payment-zalopay?orderId=${data.orderId}`;
                  break;
              }
            }
          })
      } else {
        alert("Vui lòng đặt ít nhất 1 tour!");
      }

    })
  ;

  // List Input Method
  const listInputMethod = orderForm.querySelectorAll("input[name='method']");
  const elementInfoBank = orderForm.querySelector(".inner-info-bank");

  listInputMethod.forEach(inputMethod => {
    inputMethod.addEventListener("change", () => {
      if (inputMethod.value == "bank") {
        elementInfoBank.classList.add("active");
      } else {
        elementInfoBank.classList.remove("active");
      }
    })
  })
  // End List Input Method
}
// End Order Form

// Alert
const alertTime = document.querySelector("[alert-time]");
if(alertTime) {
  let time = alertTime.getAttribute("alert-time");
  time = time ? parseInt(time) : 4000;
  setTimeout(() => {
    alertTime.remove(); // Xóa phần tử khỏi giao diện
  }, time);
}
// End Alert

// Box Filter
const boxFilter = document.querySelector(".box-filter");
if(boxFilter) {
  const url = new URL(`${window.location.origin}/search`);

  const buttonApply = boxFilter.querySelector(".inner-button");

  const filterList = [
    "locationFrom",
    "locationTo",
    "departureDate",
    "stockAdult",
    "stockChildren",
    "stockBaby",
    "price"
  ];

  buttonApply.addEventListener("click", () => {
    filterList.forEach(name => {
      const value = boxFilter.querySelector(`[name="${name}"]`).value;
      if(value) {
        url.searchParams.set(name, value);
      } else {
        url.searchParams.delete(name);
      }
    })

    window.location.href = url.href;
  })
}
// End Box Filter

// Form Search
const formSearch = document.querySelector("[form-search]");
if(formSearch) {
  const url = new URL(`${window.location.origin}/search`);

  formSearch.addEventListener("submit", (event) => {
    event.preventDefault();

    // Điểm đến
    const locationTo = formSearch.locationTo.value;
    if(locationTo) {
      url.searchParams.set("locationTo", locationTo);
    } else {
      url.searchParams.delete("locationTo");
    }

    // Số lượng
    const stockAdult = parseInt(formSearch.querySelector("[stock-adult]").innerHTML);
    if(stockAdult > 0) {
      url.searchParams.set("stockAdult", stockAdult);
    } else {
      url.searchParams.delete("stockAdult");
    }

    const stockChildren = parseInt(formSearch.querySelector("[stock-children]").innerHTML);
    if(stockChildren > 0) {
      url.searchParams.set("stockChildren", stockChildren);
    } else {
      url.searchParams.delete("stockChildren");
    }

    const stockBaby = parseInt(formSearch.querySelector("[stock-baby]").innerHTML);
    if(stockBaby > 0) {
      url.searchParams.set("stockBaby", stockBaby);
    } else {
      url.searchParams.delete("stockBaby");
    }

    // Ngày khởi hành
    const departureDate = formSearch.departureDate.value;
    if(departureDate) {
      url.searchParams.set("departureDate", departureDate);
    } else {
      url.searchParams.delete("departureDate");
    }

    window.location.href = url.href;
  })
}
// End Form Search

// Box Tour Detail
const boxTourDetail = document.querySelector(".box-tour-detail");
if(boxTourDetail) {
  // Bước 1
  const inputStockAdult = document.querySelector("[input-stock-adult]");
  const inputStockChildren = document.querySelector("[input-stock-children]");
  const inputStockBaby = document.querySelector("[input-stock-baby]");

  // Bước 3
  const drawBoxDetail = () => {
    const quantityAdult = parseInt(inputStockAdult.value);
    const quantityChildren = parseInt(inputStockChildren.value);
    const quantityBaby = parseInt(inputStockBaby.value);

    const stockAdult = document.querySelector("[stock-adult]");
    const stockChildren = document.querySelector("[stock-children]");
    const stockBaby = document.querySelector("[stock-baby]");

    stockAdult.innerHTML = quantityAdult;
    stockChildren.innerHTML = quantityChildren;
    stockBaby.innerHTML = quantityBaby;

    const priceAdult = parseInt(inputStockAdult.getAttribute("price"));
    const priceChildren = parseInt(inputStockChildren.getAttribute("price"));
    const priceBaby = parseInt(inputStockBaby.getAttribute("price"));
    const totalPrice = (quantityAdult * priceAdult) + (quantityChildren * priceChildren) + (quantityBaby * priceBaby);
    const elementTotalPrice = document.querySelector("[total-price]");
    elementTotalPrice.innerHTML = Number(totalPrice || 0).toLocaleString("vi-VN");
  }

  // Bước 2
  inputStockAdult.addEventListener("change", drawBoxDetail);
  inputStockChildren.addEventListener("change", drawBoxDetail);
  inputStockBaby.addEventListener("change", drawBoxDetail);

  // Bước 4
  const buttonAddToCart = boxTourDetail.querySelector(".inner-button-add-cart");
  buttonAddToCart.addEventListener("click", () => {
    const tourId = buttonAddToCart.getAttribute("tour-id");
    const quantityAdult = parseInt(inputStockAdult.value);
    const quantityChildren = parseInt(inputStockChildren.value);
    const quantityBaby = parseInt(inputStockBaby.value);
    const locationFrom = boxTourDetail.querySelector("[location-from]").value;

    if(quantityAdult > 0 || quantityChildren > 0 || quantityBaby > 0) {
      const cartItem = {
        tourId: tourId,
        quantityAdult: quantityAdult,
        quantityChildren: quantityChildren,
        quantityBaby: quantityBaby,
        locationFrom: locationFrom,
        checked: true

      };

      const cart = JSON.parse(localStorage.getItem("cart"));
      
      const indexItemExist = cart.findIndex(item => item.tourId == tourId);
      if(indexItemExist != -1) {
        cart[indexItemExist] = cartItem;
      } else {
        cart.push(cartItem);
      }

      localStorage.setItem("cart", JSON.stringify(cart));
      window.location.href = "/cart";
    }
  })
}
// End Box Tour Detail

// Initial Cart
const initCart = () => {
  const localCart = localStorage.getItem("cart");
  if (!localCart) {
    localStorage.setItem("cart", JSON.stringify([]));
  }
  
  // Sync với server nếu user đã đăng nhập
  syncCartWithServer();
}

// Sync giỏ hàng với server
const syncCartWithServer = async () => {
  const localCart = JSON.parse(localStorage.getItem("cart") || "[]");
  
  try {
    const response = await fetch('/cart/sync', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ localCart })
    });
    
    const data = await response.json();
    
    if (data.code === "success" && data.cart) {
      localStorage.setItem("cart", JSON.stringify(data.cart));
      updateMiniCart();
    }
  } catch (error) {
    console.error("Error syncing cart:", error);
  }
}

// Update giỏ hàng lên server
const updateCartToServer = async (cart) => {
  try {
    await fetch('/cart/update', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ cart })
    });
  } catch (error) {
    console.error("Error updating cart:", error);
  }
}

initCart();
// End Initial Cart

// Mini Cart
const miniCart = document.querySelector("[mini-cart]");
const updateMiniCart = () => {
  if (miniCart) {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    miniCart.innerHTML = cart.length;
  }
}
updateMiniCart();
// End Mini Cart

// Page Cart
const drawCart = () => {
  const cart = localStorage.getItem("cart");

  fetch(`/cart/detail`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: cart
  })
    .then(res => res.json())
    .then(data => {
      if(data.code == "success") {
        // Hiển thị các item
        const htmlCart = data.cart.map((item, index) => {
          // Hiển thị danh sách ghế
          const seatsHtml = item.seats && item.seats.length > 0 
            ? `<div class="detail-row">
                <span class="detail-label">Ghế đã chọn:</span>
                <span class="detail-value inner-seat-list">${item.seats.join(', ')}</span>
              </div>`
            : '';
          
          // Hiển thị danh sách combo
          let combosHtml = '';
          if (item.combos) {
            const comboList = [];
            Object.keys(item.combos).forEach(key => {
              const combo = item.combos[key];
              if (combo && combo.quantity > 0) {
                comboList.push(`${combo.name} x${combo.quantity}`);
              }
            });
            
            if (comboList.length > 0) {
              combosHtml = `<div class="detail-row">
                <span class="detail-label">Combo:</span>
                <span class="detail-value inner-combo-list">${comboList.join('<br>')}</span>
              </div>`;
            }
          }
          
          // Hiển thị chi tiết giá
          const priceBreakdown = `
            <div class="inner-price-breakdown">
              <div class="detail-row">
                <span class="detail-label">Tiền vé:</span>
                <span class="detail-value">${Number(item.totalSeatPrice || 0).toLocaleString("vi-VN")}đ</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Tiền combo:</span>
                <span class="detail-value">${Number(item.totalComboPrice || 0).toLocaleString("vi-VN")}đ</span>
              </div>
              <div class="detail-row">
                <span class="detail-label"><strong>Tổng cộng:</strong></span>
                <span class="detail-value"><strong>${Number(item.totalPrice || 0).toLocaleString("vi-VN")}đ</strong></span>
              </div>
            </div>
          `;

          return `
            <div class="inner-tour-item">
              <div class="inner-actions">
                <button class="inner-delete" button-delete data-index="${index}" tour-id="${item.tourId}">
                  <i class="fa-solid fa-xmark"></i>
                </button>
                <input 
                  class="inner-check" 
                  type="checkbox" ${item.checked ? 'checked' : ''}
                  input-check
                  data-index="${index}"
                  tour-id="${item.tourId}"
                >
              </div>
              <div class="inner-product">
                <div class="inner-image">
                  <a href="/tour/detail/${item.slug}">
                    <img alt="" src="${item.avatar}">
                  </a>
                </div>
                <div class="inner-content">
                  <div class="inner-title">
                    <a href="/tour/detail/${item.slug}">
                      ${item.name}
                    </a>
                  </div>
                  <div class="inner-meta">
                    <div class="inner-meta-item">Ngày Chiếu: <b>${item.departureDateFormat}</b></div>
                    <div class="inner-meta-item">Rạp Chiếu: <b>${item.locationFromName}</b></div>
                  </div>
                  <div class="inner-booking-details">
                    ${seatsHtml}
                    ${combosHtml}
                    ${priceBreakdown}
                  </div>
                </div>
              </div>
            </div>
          `;
        });

        const cartList = document.querySelector("[cart-list]");
        cartList.innerHTML = htmlCart.join("");

        // Cập nhật lại giỏ hàng
        localStorage.setItem("cart", JSON.stringify(data.cart));
        updateMiniCart();
        updateCartToServer(data.cart);

        // Tính tổng tiền
        const subTotalPrice = data.cart.reduce((sum, item) => {
          if(item.checked) {
            return sum + (item.totalPrice || 0);
          } else {
            return sum;
          }
        }, 0);
        
        const discount = 0;
        const totalPrice = subTotalPrice - discount;
        
        const cartSubTotal = document.querySelector("[cart-sub-total]");
        if (cartSubTotal) cartSubTotal.innerHTML = Number(subTotalPrice || 0).toLocaleString("vi-VN");

        const cartTotal = document.querySelector("[cart-total]");
        if (cartTotal) cartTotal.innerHTML = Number(totalPrice || 0).toLocaleString("vi-VN");

        // Sự kiện xóa item (sử dụng data-index để xử lý nhiều item cùng tour)
        const listButtonDelete = document.querySelectorAll("[button-delete]");
        listButtonDelete.forEach(button => {
          button.addEventListener("click", () => {
            const idx = parseInt(button.getAttribute('data-index'));
            const cart = JSON.parse(localStorage.getItem("cart") || '[]');
            if (!isNaN(idx) && idx >= 0 && idx < cart.length) {
              cart.splice(idx, 1);
              localStorage.setItem("cart", JSON.stringify(cart));
              updateCartToServer(cart);
              drawCart();
            }
          })
        })

        // Sự kiện check item (dùng data-index để xác định item chính xác)
        const listInputCheck = document.querySelectorAll("[input-check]");
        listInputCheck.forEach(input => {
          input.addEventListener("change", () => {
            const checked = input.checked;
            const idx = parseInt(input.getAttribute('data-index'));
            const cart = JSON.parse(localStorage.getItem("cart") || '[]');
            if (!isNaN(idx) && idx >= 0 && idx < cart.length) {
              cart[idx].checked = checked;
              localStorage.setItem("cart", JSON.stringify(cart));
              updateCartToServer(cart);
              drawCart();
            }
          })
        })
      }
    })
}

const pageCart = document.querySelector("[page-cart]");
if(pageCart) {
  drawCart();
}
// End Page Cart

// Box Movie Detail - Cinema Booking
const boxMovieDetail = document.querySelector(".box-tour-detail");
if(boxMovieDetail) {
  const buttonAddToCart = boxMovieDetail.querySelector(".inner-button-add-cart");

  if(buttonAddToCart) {
    buttonAddToCart.addEventListener('click', () => {
      // Get the seat selections from the visual DOM (elements with seat-selected class)
      const selectedSeats = Array.from(document.querySelectorAll('.seat.seat-selected')).map(s => s.dataset.seat);
      
      if(selectedSeats.length === 0) {
        alert("Vui lòng chọn ít nhất 1 ghế!");
        return;
      }

      const tourId = buttonAddToCart.getAttribute("tour-id");
      const locationFromEl = boxMovieDetail.querySelector("[location-from]");
      const locationFrom = locationFromEl ? locationFromEl.value : '';

      // Lấy danh sách combo từ DOM inputs (được quản lý bởi inline script)
      const combosKeys = ['popcorn','coke','hotdog','water','comboset'];
      const combos = {};
      combosKeys.forEach(key => {
        const input = document.querySelector(`input[data-combo-input="${key}"]`);
        const quantity = input ? parseInt(input.value) || 0 : 0;
        const comboItemEl = input ? input.closest('.combo-item') : null;
        const comboNameEl = comboItemEl ? comboItemEl.querySelector('.combo-name') : null;
        const comboPriceEl = comboItemEl ? comboItemEl.querySelector('.combo-price') : null;
        const name = comboNameEl ? comboNameEl.textContent.trim() : key;
        let price = 0;
        if (comboPriceEl) {
          const priceText = comboPriceEl.textContent.trim();
          price = parseInt(priceText.replace(/[^\d]/g, '')) || 0;
        }
        combos[key] = { name: name, price: price, quantity: quantity };
      });

      const cartItem = {
        tourId: tourId,
        locationFrom: locationFrom,
        seats: selectedSeats,
        combos: combos,
        checked: true
      };

      let cart = JSON.parse(localStorage.getItem("cart") || '[]');

      // If same tourId+locationFrom exists, replace it (current behavior).
      // This ensures seats & combos are included.
      const indexItemExist = cart.findIndex(item => item.tourId == tourId && item.locationFrom == locationFrom);
      if(indexItemExist != -1) {
        cart[indexItemExist] = cartItem;
      } else {
        cart.push(cartItem);
      }

      localStorage.setItem("cart", JSON.stringify(cart));
      updateCartToServer(cart);
      window.location.href = "/cart";
    });
  }
}
// End Box Movie Detail
// End Box Movie Detail
// User Register Form
const userRegisterForm = document.querySelector("#user-register-form");
if (userRegisterForm) {
  const validation = new JustValidate('#user-register-form');

  validation
    .addField('#full-name-input', [
      {
        rule: 'required',
        errorMessage: 'Vui lòng nhập họ tên!'
      },
      {
        rule: 'minLength',
        value: 5,
        errorMessage: 'Họ tên phải có ít nhất 5 ký tự!',
      },
      {
        rule: 'maxLength',
        value: 50,
        errorMessage: 'Họ tên không được vượt quá 50 ký tự!',
      },
    ])
    .addField('#email-input', [
      {
        rule: 'required',
        errorMessage: 'Vui lòng nhập email!'
      },
      {
        rule: 'email',
        errorMessage: 'Email không đúng định dạng!'
      },
    ])
    .addField('#phone-input', [
      {
        rule: 'required',
        errorMessage: 'Vui lòng nhập số điện thoại!'
      },
      {
        rule: 'customRegexp',
        value: /(84|0[3|5|7|8|9])+([0-9]{8})\b/g,
        errorMessage: 'Số điện thoại không đúng định dạng!'
      },
    ])
    .addField('#password-input', [
      {
        rule: 'required',
        errorMessage: 'Vui lòng nhập mật khẩu!'
      },
      {
        rule: 'minLength',
        value: 8,
        errorMessage: 'Mật khẩu phải có ít nhất 8 ký tự!',
      },
      {
        rule: 'customRegexp',
        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        errorMessage: 'Mật khẩu phải chứa chữ hoa, chữ thường, số và ký tự đặc biệt!',
      },
    ])
    .onSuccess((event) => {
      const formData = {
        fullName: event.target.fullName.value,
        email: event.target.email.value,
        phone: event.target.phone.value,
        password: event.target.password.value
      };

      fetch(`/user/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
        .then(res => res.json())
        .then(data => {
          if (data.code == "error") {
            alert(data.message);
          }

          if (data.code == "success") {
            alert(data.message);
            window.location.href = "/user/profile";
          }
        });
    });
}

// User Login Form
const userLoginForm = document.querySelector("#user-login-form");
if (userLoginForm) {
  const validation = new JustValidate('#user-login-form');

  validation
    .addField('#email-input', [
      {
        rule: 'required',
        errorMessage: 'Vui lòng nhập email!'
      },
      {
        rule: 'email',
        errorMessage: 'Email không đúng định dạng!'
      },
    ])
    .addField('#password-input', [
      {
        rule: 'required',
        errorMessage: 'Vui lòng nhập mật khẩu!'
      },
    ])
    .onSuccess((event) => {
      const formData = {
        email: event.target.email.value,
        password: event.target.password.value,
        rememberPassword: event.target.rememberPassword.checked
      };

      fetch(`/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
        .then(res => res.json())
        .then(data => {
          if (data.code == "error") {
            alert(data.message);
          }

          if (data.code == "success") {
            const localCart = JSON.parse(localStorage.getItem('cart') || '[]');
            const serverCart = data.cart || [];
            
            // Merge: ưu tiên giỏ hàng local (mới hơn)
            const mergedCart = [...localCart];
            serverCart.forEach(serverItem => {
              const exists = mergedCart.find(
                localItem => localItem.tourId === serverItem.tourId
              );
              if (!exists) {
                mergedCart.push(serverItem);
              }
            });
            
            localStorage.setItem('cart', JSON.stringify(mergedCart));
            
            // Sync lại lên server
            fetch('/cart/update', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ cart: mergedCart })
            }).then(() => {
              alert(data.message);
              window.location.href = "/";
            });
          }
        });
    });
}
// User Profile Form
const userProfileForm = document.querySelector("#user-profile-form");
if (userProfileForm) {
  userProfileForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(userProfileForm);

    fetch(`/user/profile/edit`, {
      method: "PATCH",
      body: formData
    })
      .then(res => res.json())
      .then(data => {
        if (data.code == "error") {
          alert(data.message);
        }

        if (data.code == "success") {
          window.location.reload();
        }
      });
  });
}

// User Change Password Form
const userChangePasswordForm = document.querySelector("#user-change-password-form");
if (userChangePasswordForm) {
  const validation = new JustValidate('#user-change-password-form');

  validation
    .addField('input[name="oldPassword"]', [
      {
        rule: 'required',
        errorMessage: 'Vui lòng nhập mật khẩu cũ!'
      },
    ])
    .addField('input[name="password"]', [
      {
        rule: 'required',
        errorMessage: 'Vui lòng nhập mật khẩu mới!'
      },
      {
        rule: 'minLength',
        value: 8,
        errorMessage: 'Mật khẩu phải có ít nhất 8 ký tự!',
      },
    ])
    .addField('input[name="confirmPassword"]', [
      {
        rule: 'required',
        errorMessage: 'Vui lòng xác nhận mật khẩu!'
      },
      {
        validator: (value, fields) => {
          return value === fields['input[name="password"]'].elem.value;
        },
        errorMessage: 'Mật khẩu xác nhận không khớp!',
      },
    ])
    .onSuccess((event) => {
      const formData = {
        oldPassword: event.target.oldPassword.value,
        password: event.target.password.value
      };

      fetch(`/user/change-password`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
        .then(res => res.json())
        .then(data => {
          if (data.code == "error") {
            alert(data.message);
          }

          if (data.code == "success") {
            alert(data.message);
            window.location.href = "/user/profile";
          }
        });
    });
}

// User Forgot Password Form
const userForgotPasswordForm = document.querySelector("#user-forgot-password-form");
if (userForgotPasswordForm) {
  const validation = new JustValidate('#user-forgot-password-form');

  validation
    .addField('input[name="email"]', [
      {
        rule: 'required',
        errorMessage: 'Vui lòng nhập email!'
      },
      {
        rule: 'email',
        errorMessage: 'Email không đúng định dạng!'
      },
    ])
    .onSuccess((event) => {
      const formData = {
        email: event.target.email.value
      };

      fetch(`/user/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
        .then(res => res.json())
        .then(data => {
          if (data.code == "error") {
            alert(data.message);
          }

          if (data.code == "success") {
            alert(data.message);
            localStorage.setItem("forgotPasswordEmail", formData.email);
            window.location.href = "/user/otp-password";
          }
        });
    });
}

// User OTP Password Form
const userOtpPasswordForm = document.querySelector("#user-otp-password-form");
if (userOtpPasswordForm) {
  const email = localStorage.getItem("forgotPasswordEmail");
  if (email) {
    userOtpPasswordForm.querySelector('input[name="email"]').value = email;
  }

  const validation = new JustValidate('#user-otp-password-form');

  validation
    .addField('input[name="otp"]', [
      {
        rule: 'required',
        errorMessage: 'Vui lòng nhập mã OTP!'
      },
    ])
    .onSuccess((event) => {
      const formData = {
        otp: event.target.otp.value,
        email: event.target.email.value
      };

      fetch(`/user/otp-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
        .then(res => res.json())
        .then(data => {
          if (data.code == "error") {
            alert(data.message);
          }

          if (data.code == "success") {
            alert(data.message);
            localStorage.removeItem("forgotPasswordEmail");
            window.location.href = "/user/reset-password";
          }
        });
    });
}

// User Reset Password Form
const userResetPasswordForm = document.querySelector("#user-reset-password-form");
if (userResetPasswordForm) {
  const validation = new JustValidate('#user-reset-password-form');

  validation
    .addField('input[name="password"]', [
      {
        rule: 'required',
        errorMessage: 'Vui lòng nhập mật khẩu mới!'
      },
      {
        rule: 'minLength',
        value: 8,
        errorMessage: 'Mật khẩu phải có ít nhất 8 ký tự!',
      },
    ])
    .addField('input[name="confirmPassword"]', [
      {
        rule: 'required',
        errorMessage: 'Vui lòng xác nhận mật khẩu!'
      },
      {
        validator: (value, fields) => {
          return value === fields['input[name="password"]'].elem.value;
        },
        errorMessage: 'Mật khẩu xác nhận không khớp!',
      },
    ])
    .onSuccess((event) => {
      const formData = {
        password: event.target.password.value
      };

      fetch(`/user/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
        .then(res => res.json())
        .then(data => {
          if (data.code == "error") {
            alert(data.message);
          }

          if (data.code == "success") {
            alert(data.message);
            window.location.href = "/user/login";
          }
        });
    });
}

// Logout
const logoutLink = document.querySelector(".logout-link");
if (logoutLink) {
  logoutLink.addEventListener("click", () => {
    if (confirm("Bạn có chắc muốn đăng xuất?")) {
      fetch(`/user/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        }
      })
        .then(res => res.json())
        .then(data => {
          if (data.code == "success") {
            window.location.href = "/";
          }
        });
    }
  });
}