'use strict';

const Translator = require('../components/translator.js');

module.exports = function (app) {
  
  const translator = new Translator();

  app.route('/api/translate')
    .post((req, res) => {
      const { text, locale } = req.body;

      // validate required fields
      if (text === undefined || !locale) {
        return res.json({ error: 'Required field(s) missing' });
      }

      // validate text is not empty
      if (text === '') {
        return res.json({ error: 'No text to translate' });
      }

      // validate locale
      if (locale !== 'american-to-british' && locale !== 'british-to-american') {
        return res.json({ error: 'Invalid value for locale field' });
      }

      // perform translation
      const result = translator.translate(text, locale);
      
      if (result.error) {
        return res.json({ error: result.error });
      }

      res.json(result);
    });
};
