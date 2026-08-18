$(document).ready(function () {
  // Toggle abstract / award / bibtex panels (search from the bibliography list item — not .links parent, since panels are siblings of .links-and-badges)
  function publicationEntryRoot($btn) {
    var $li = $btn.closest("li");
    return $li.length ? $li : $btn.closest(".col-sm-12");
  }
  $(document).on("click", "a.abstract", function (e) {
    e.preventDefault();
    var $root = publicationEntryRoot($(this));
    $root.find(".abstract.hidden").toggleClass("open");
    $root.find(".award.hidden.open, .bibtex.hidden.open").removeClass("open");
  });
  $(document).on("click", "a.award", function (e) {
    e.preventDefault();
    var $root = publicationEntryRoot($(this));
    $root.find(".award.hidden").toggleClass("open");
    $root.find(".abstract.hidden.open, .bibtex.hidden.open").removeClass("open");
  });
  $(document).on("click", "a.bibtex", function (e) {
    e.preventDefault();
    var $root = publicationEntryRoot($(this));
    $root.find(".bibtex.hidden").toggleClass("open");
    $root.find(".abstract.hidden.open, .award.hidden.open").removeClass("open");
  });
  // Download BibTeX from the expanded block (button rendered in _layouts/bib.liquid)
  $(document).on("click", "a.bibtex-download", function (e) {
    e.preventDefault();
    var $block = $(this).closest(".bibtex.hidden");
    var text = $block.find("pre").first().text();
    if (!text || !text.trim()) {
      return;
    }
    var filename = $(this).attr("data-bib-filename") || "citation.bib";
    var blob = new Blob([text.replace(/\n$/, "") + "\n"], { type: "text/plain;charset=utf-8" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });
  $("a").removeClass("waves-effect waves-light");

  // bootstrap-toc
  if ($("#toc-sidebar").length) {
    // remove related publications years from the TOC
    $(".publications h2").each(function () {
      $(this).attr("data-toc-skip", "");
    });
    var navSelector = "#toc-sidebar";
    var $myNav = $(navSelector);
    Toc.init($myNav);
    $("body").scrollspy({
      target: navSelector,
      offset: 100,
    });
  }

  // add css to jupyter notebooks
  const cssLink = document.createElement("link");
  cssLink.href = "../css/jupyter.css";
  cssLink.rel = "stylesheet";
  cssLink.type = "text/css";

  let jupyterTheme = determineComputedTheme();

  $(".jupyter-notebook-iframe-container iframe").each(function () {
    $(this).contents().find("head").append(cssLink);

    if (jupyterTheme == "dark") {
      $(this).bind("load", function () {
        $(this).contents().find("body").attr({
          "data-jp-theme-light": "false",
          "data-jp-theme-name": "JupyterLab Dark",
        });
      });
    }
  });

  // trigger popovers
  $('[data-toggle="popover"]').popover({
    trigger: "hover",
  });
});
