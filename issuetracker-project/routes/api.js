'use strict';

const Issue = require('../models/Issue.js');
const mongoose = require('mongoose');

module.exports = function (app) {

  app.route('/api/issues/:project')

    // GET: Ver issues
    .get(async function (req, res) {
      let project = req.params.project;
      let filter = req.query;
      if (filter.open !== undefined) filter.open = filter.open === 'true';
      try {
        const issues = await Issue.find({ project, ...filter }).exec();
        res.json(issues);
      } catch (err) {
        res.json({ error: 'could not fetch issues' });
      }
    })

    // POST: Crear issue
    .post(async function (req, res) {
      let project = req.params.project;
      let { issue_title, issue_text, created_by, assigned_to, status_text } = req.body;

      if (!issue_title || !issue_text || !created_by) {
        return res.json({ error: 'required field(s) missing' });
      }

      let newIssue = new Issue({
        project,
        issue_title,
        issue_text,
        created_by,
        assigned_to: assigned_to || '',
        status_text: status_text || '',
      });

      try {
        let saved = await newIssue.save();
        res.json(saved);
      } catch (err) {
        res.json({ error: 'could not create issue' });
      }
    })

    // PUT: Actualizar issue
    .put(async function (req, res) {
      let { _id, issue_title, issue_text, created_by, assigned_to, status_text, open } = req.body;

      if (!_id) return res.json({ error: 'missing _id' });

      let updateFields = {};
      if (issue_title) updateFields.issue_title = issue_title;
      if (issue_text) updateFields.issue_text = issue_text;
      if (created_by) updateFields.created_by = created_by;
      if (assigned_to) updateFields.assigned_to = assigned_to;
      if (status_text) updateFields.status_text = status_text;
      if (open !== undefined) updateFields.open = open;

      if (Object.keys(updateFields).length === 0) {
        return res.json({ error: 'no update field(s) sent', _id });
      }

      updateFields.updated_on = new Date(); 

      try {
        if (!mongoose.Types.ObjectId.isValid(_id)) {
          return res.json({ error: 'could not update', _id });
        }

        let updated = await Issue.findByIdAndUpdate(_id, updateFields, { new: true }).exec();
        if (!updated) return res.json({ error: 'could not update', _id });

        res.json({ result: 'successfully updated', _id });

      } catch (err) {
        res.json({ error: 'could not update', _id });
      }
    })

    // DELETE: Borrar issue
    .delete(async function (req, res) {
      let { _id } = req.body;

      if (!_id) return res.json({ error: 'missing _id' });

      try {
        if (!mongoose.Types.ObjectId.isValid(_id)) {
          return res.json({ error: 'could not delete', _id });
        }

        let deleted = await Issue.findByIdAndDelete(_id).exec();
        if (!deleted) return res.json({ error: 'could not delete', _id });

        res.json({ result: 'successfully deleted', _id });

      } catch (err) {
        res.json({ error: 'could not delete', _id });
      }
    });
};

