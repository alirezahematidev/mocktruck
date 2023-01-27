const mjsResolver = (path, options) => {
    const mjsExtRegex = /\.mjs$/i;
    const resolver = options.defaultResolver;
    if (mjsExtRegex.test(path)) {
        return resolver(path.replace(mjsExtRegex, '.mts'), options);
    }

    return resolver(path, options);
};

module.exports = mjsResolver;