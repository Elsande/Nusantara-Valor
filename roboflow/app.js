$(function () {
  //values pulled from query string
  $("#model").val("classgarbage");
  $("#version").val("2");
  $("#api_key").val("zHAUzLCR1emSoJVrOiFj");

  setupButtonListeners();
});

var infer = function () {
  $("#output").html("Inferring...");
  $("#resultContainer").show();
  $("html").scrollTop(100000);

  getSettingsFromForm(function (settings) {
    settings.error = function (xhr) {
      $("#output")
        .html("")
        .append(
          [
            "Error loading response.",
            "",
            "Check your API key, model, version,",
            "and other parameters",
            "then try again.",
          ].join("\n")
        );
    };

    $.ajax(settings).then(function (response) {
      var pretty = $("<pre>");
      var formatted = JSON.stringify(response, null, 4);

      pretty.html(formatted);
      $("#output").html("").append(pretty);
      $("html").scrollTop(100000);
    });
  });
};

var retrieveDefaultValuesFromLocalStorage = function () {
  try {
    var api_key = localStorage.getItem("rf.api_key");
    var model = localStorage.getItem("rf.model");
    var format = localStorage.getItem("rf.format");

    if (api_key) $("#api_key").val(api_key);
    if (model) $("#model").val(model);
    if (format) $("#format").val(format);
  } catch (e) {
    // localStorage disabled
  }

  $("#model").change(function () {
    localStorage.setItem("rf.model", $(this).val());
  });

  $("#api_key").change(function () {
    localStorage.setItem("rf.api_key", $(this).val());
  });

  $("#format").change(function () {
    localStorage.setItem("rf.format", $(this).val());
  });
};

var setupButtonListeners = function () {
  // run inference when the form is submitted
  $("#inputForm").submit(function () {
    infer();
    return false;
  });

  // make the buttons blue when clicked
  // and show the proper "Select file" or "Enter url" state
  $(".bttn").click(function () {
    $(this).parent().find(".bttn").removeClass("active");
    $(this).addClass("active");

    if ($("#computerButton").hasClass("active")) {
      $("#fileSelectionContainer").show();
      $("#urlContainer").hide();
    } else {
      $("#fileSelectionContainer").hide();
      $("#urlContainer").show();
    }

    if ($("#jsonButton").hasClass("active")) {
      $("#imageOptions").hide();
    } else {
      $("#imageOptions").show();
    }

    return false;
  });

  // wire styled button to hidden file input
  $("#fileMock").click(function () {
    $("#file").click();
  });

  // grab the filename when a file is selected
  $("#file").change(function () {
    var path = $(this).val().replace(/\\/g, "/");
    var parts = path.split("/");
    var filename = parts.pop();
    $("#fileName").val(filename);
  });
};

var getSettingsFromForm = function (cb) {
  var settings = {
    method: "POST",
  };

  var parts = [
    "https://classify.roboflow.com/",
    $("#model").val(),
    "/",
    $("#version").val(),
    "?api_key=" + $("#api_key").val(),
  ];

  var method = $("#method .active").attr("data-value");
  if (method == "upload") {
    var file = $("#file").get(0).files && $("#file").get(0).files.item(0);
    if (!file) return alert("Please select a file.");

    getBase64fromFile(file).then(function (base64image) {
      settings.url = parts.join("");
      settings.data = base64image;

      console.log(settings);
      cb(settings);
    });
  } else {
    var url = $("#url").val();
    if (!url) return alert("Please enter an image URL");

    parts.push("&image=" + encodeURIComponent(url));

    settings.url = parts.join("");
    console.log(settings);
    cb(settings);
  }
};

var getBase64fromFile = function (file) {
  return new Promise(function (resolve, reject) {
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      resizeImage(reader.result).then(function (resizedImage) {
        resolve(resizedImage);
      });
    };
    reader.onerror = function (error) {
      reject(error);
    };
  });
};

var resizeImage = function (base64Str) {
  return new Promise(function (resolve, reject) {
    var img = new Image();
    img.src = base64Str;
    img.onload = function () {
      var canvas = document.createElement("canvas");
      var MAX_WIDTH = 1500;
      var MAX_HEIGHT = 1500;
      var width = img.width;
      var height = img.height;
      if (width > height) {
        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        }
      } else {
        if (height > MAX_HEIGHT) {
          width *= MAX_HEIGHT / height;
          height = MAX_HEIGHT;
        }
      }
      canvas.width = width;
      canvas.height = height;
      var ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL("image/jpeg", 1.0));
    };
  });
};

$(document).ready(function () {
  // Menggunakan jQuery untuk menyembunyikan elemen yang spesifik
  $("#model").parent().hide(); // menyembunyikan elemen yang mengandung input model
  $("#version").parent().hide(); // menyembunyikan elemen yang mengandung input version
  $("#api_key").parent().hide(); // menyembunyikan elemen yang mengandung input api key
});

function displayImageAndResults(response, imageUrl) {
    // Extract confidence levels from the response
    let confidenceTidakLayak = null;
    let confidenceLayak = null;

    response.predictions.forEach(prediction => {
        if (prediction.class === "tidak-layak") {
            confidenceTidakLayak = prediction.confidence;
        } else if (prediction.class === "layak") {
            confidenceLayak = prediction.confidence;
        }
    });

    // Clear previous output
    $("#output").html("");

    // Create and append the image element
    var img = document.createElement("img");
    img.src = imageUrl;
    img.style.maxWidth = "50%"; // Adjust the size as needed
    img.alt = "Scanned Image";
    $("#output").append(img);

    // Create and append the h1 element for the results
    var h1 = document.createElement("h1");

    if (confidenceLayak > confidenceTidakLayak) {
        if (confidenceLayak > 0.9) {
            h1.innerHTML = "Barang Layak";
            h1.style.color = "green"; // Set the color to green
        } else {
            h1.innerHTML = `confidence: ${(confidenceLayak * 100).toFixed(
                2
            )}% Ajukan Banding?`;
            h1.style.color = "orange";
        }
    } else {
        if (confidenceTidakLayak > 0.9) {
            h1.innerHTML = "Barang Tidak Layak";
            h1.style.color = "red"; // Set the color to red
        } else {
            h1.innerHTML = `confidence: ${(confidenceTidakLayak * 100).toFixed(
                2
            )}% Ajukan Banding?`;
            h1.style.color = "orange";
        }
    }

    // Append the h1 element to the output div
    $("#output").append(h1);
}

// Updated infer function to call displayImageAndResults
var infer = function () {
    $("#output").html("Inferring...");
    $("#resultContainer").show();
    $("html").scrollTop(100000);

    getSettingsFromForm(function (settings) {
        settings.error = function (xhr) {
            $("#output")
                .html("")
                .append(
                    [
                        "Error loading response.",
                        "",
                        "Check your API key, model, version,",
                        "and other parameters",
                        "then try again.",
                    ].join("\n")
                );
        };

        $.ajax(settings).then(function (response) {
            var imageUrl;

            // Determine the image URL based on the method
            var method = $("#method .active").attr("data-value");
            if (method == "upload") {
                var file = $("#file").get(0).files[0];
                var reader = new FileReader();
                reader.onload = function (e) {
                    imageUrl = e.target.result;
                    displayImageAndResults(response, imageUrl); // Call the new function with the image URL
                };
                reader.readAsDataURL(file);
            } else {
                imageUrl = $("#url").val();
                displayImageAndResults(response, imageUrl); // Call the new function with the image URL
            }

            // Pretty print the response (optional)
            var pretty = $("<pre>");
            var formatted = JSON.stringify(response, null, 4);
            pretty.html(formatted);
            $("#output").append(pretty);
            $("html").scrollTop(100000);
        });
    });
};
