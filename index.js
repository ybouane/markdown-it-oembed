"use strict";
const H = require("upperh");
const providers = require("./providers.json");

const setup = function (md, options) {
    var defaultRender = md.renderer.rules.image;
    var toReplace = {};
    var providersRegexp = [];
    for (let provider of providers) {
        for (let endpoint of provider.endpoints) {
            if (endpoint.schemes) {
                for (let scheme of endpoint.schemes) {
                    providersRegexp.push([
                        new RegExp(
                            "^" + H.regexpEscape(scheme).replace(/\\\*/g, ".+")
                        ),
                        endpoint.url.replace(/\{format\}/, "json"),
                    ]);
                }
            }
        }
    }
    const parseOEmbed = async ([url, data]) => {
        try {
            data = await data;
        } catch (e) {
            data = undefined;
        }
        if (H.isObject(data)) {
            switch (data.type) {
                case "rich":
                case "video":
                    return `<div class="embed embed-service-${data.provider_name.toLowerCase()}">
							${data.html}
						</div>`;
                    break;
                case "photo":
                    return (
                        '<img src="' +
                        H.escape(data.url) +
                        '" alt="' +
                        H.escape(data.title || "") +
                        '" width="' +
                        H.escape(data.width) +
                        '" height="' +
                        H.escape(data.height) +
                        '" />'
                    );
                    break;
            }
        }
        return '<a href="' + H.escape(url) + '">' + H.escape(url) + "</a>";
    };
    md.renderAsync = async function (src, env) {
        env = env || {};
        env.oEmbed = true;
        env.toReplace = {};
        var out = this.renderer.render(this.parse(src, env), this.options, env);
        for (let r of Object.entries(env.toReplace)) {
            try {
                out = out.replace(r[0], await parseOEmbed(r[1]));
            } catch (e) {
                console.error(e);
            }
        }
        return out;
    };
    md.renderInlineAsync = async function (src, env) {
        env = env || {};
        env.oEmbed = true;
        env.toReplace = {};
        var out = this.renderer.render(
            this.parseInline(src, env),
            this.options,
            env
        );
        for (let r of Object.entries(env.toReplace)) {
            try {
                out = out.replace(r[0], await parseOEmbed(r[1]));
            } catch (e) {
                console.error(e);
            }
        }
        return out;
    };
    md.renderer.rules.image = function (tokens, idx, options, env, self) {
        if (env.oEmbed) {
            var token = tokens[idx];
            var aIndex = token.attrIndex("src");
            var url = token.attrs[aIndex][1];
            for (let reg of providersRegexp) {
                if (reg[0].test(url)) {
                    var id = H.uniqueToken();
                    env.toReplace[id] = [
                        url,
                        H.httpGet(
                            reg[1] + "?url=" + encodeURIComponent(url),
                            undefined,
                            undefined,
                            "form",
                            "json"
                        ),
                    ];
                    return id;
                }
            }
        }
        return defaultRender(tokens, idx, options, env, self);
    };
};

module.exports = setup;
