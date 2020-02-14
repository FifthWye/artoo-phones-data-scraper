const scraper = {
  iterator:
    ".b-listing_offers > .m-grid > .m-grid_item > .m-offerBox > .m-offerBox_inner",
  data: {
    name: {
      sel: ".m-offerBox_data > a.m-typo",
      method: function($) {
        let str = $(this).text();
        str = str.trim()
        return str;
      }
    },
    brand: {
      sel: ".m-offerBox_data > a.m-typo",
      method: function($) {
        let str = $(this).text();
        str = str.trim()
        const words = str.split(" ");
        //First word of link text is a phone brand
        return words[0];
      }
    },
    price: {
      sel: ".m-priceBox > .m-priceBox_new",
      method: function($) {
        const price =
          $(this)
            .find("span.m-priceBox_price")
            .text() +
          "." +
          $(this)
            .find("span.m-priceBox_meta > span.m-priceBox_rest")
            .text();
        return parseFloat(price);
      }
    },
    url: {
      sel: ".m-offerBox_data > a.m-typo",
      method: function($) {
        return window.location.href + $(this).attr("href");
      }
    },
    badges: {
      sel: ".m-offerBox_photo > .b-emblem",
      method: function($) {
        let urls = [];

        $(this)
          .find(".b-emblem.s-emblem img")
          .each(function() {
            urls.push($(this).attr("src"));
          });

        return urls;
      }
    }
  }
};

function nextUrl($page) {
  return $page.find("a.m-pagination_next").attr("href");
}

var frontpage = artoo.scrape(scraper);

artoo.ajaxSpider(
  function(i, $data) {
    return nextUrl(!i ? artoo.$(document) : $data);
  },
  {
    scrape: scraper,
    concat: true,
    done: function(data) {
      artoo.savePrettyJson(frontpage.concat(data), { filename: "phones.json" });
    }
  }
);
