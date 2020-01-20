const through2 = require("through2");
const pluginError = require("plugin-error");
const htmlMinifier = require("html-minifier");

module.exports = (options = {}) => {
	return through2.obj((file, encoding, callback) => {
		if (file.isNull()) {
			return callback(null, file);
		}

		if (file.isStream()) {
			return callback(
				new pluginError("gulp-html-minifier", "Streaming not supported")
			);
		}

		(async () => {
			try {
				file.contents = Buffer.from(
					htmlMinifier.minify(file.contents.toString(), options)
				);
				setImmediate(callback, null, file);
			} catch (error) {
				process.stderr.write(
					`${new pluginError(
						"gulp-html-minifier",
						error.message
					).toString()} \r\n`
				);
				return callback();
			}
		})();
	});
};
