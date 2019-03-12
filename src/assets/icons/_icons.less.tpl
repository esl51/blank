@font-face {
    font-family: "<%= fontName %>";
    src: url('<%= fontPath %><%= fontName %>.woff2?<%= _.now() %>') format('woff2'),
         url('<%= fontPath %><%= fontName %>.woff?<%= _.now() %>') format('woff'),
         url('<%= fontPath %><%= fontName %>.ttf?<%= _.now() %>') format('truetype');
}

.<%= cssClass%>-base-pseudo {
    font-family: "<%= fontName %>";
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    font-style: normal;
    font-variant: normal;
    font-weight: normal;
    // speak: none; // only necessary if not using the private unicode range (firstGlyph option)
    text-decoration: none;
    text-transform: none;
    line-height: 1;
}

.<%= cssClass%>-char(@filename) {
    <% _.each(glyphs, function(glyph) { %>@<%= glyph.fileName %>: "\<%= glyph.codePoint %>";
    <% }); %>
    content: @@filename;
}

.<%= cssClass%>(@filename, @insert: before) {
    @pseudo-selector: ~":@{insert}";

    &@{pseudo-selector} {
        &:extend(.<%= cssClass%>-base-pseudo);
        .<%= cssClass%>-char(@filename);
    }
}

<% _.each(glyphs, function(glyph) { %>.<%= cssClass%>-<%= glyph.fileName %> {
    .<%= cssClass%>(<%= glyph.fileName %>);
}
<% }); %>