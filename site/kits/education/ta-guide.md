# TA guide

One page: check a whole batch of sealed submissions at once. Time: a few minutes for a full section, most of it unzipping.

## The five steps

1. On the Canvas assignment page, choose **Download Submissions**. Canvas gives you one zip of every student's file.
2. Unzip it.
3. Open **knobe.org/studio** and choose the **Cohort check** tab.
4. Load the journey file (or the assignment spec) under *What should these chain to?* This sets the expectation: submissions should link to that file's fingerprint.
5. Drag the unzipped folder onto the drop zone. Every readable file is verified on the spot, in your browser. Nothing is uploaded.

## Reading the table

One row per file. Rows to look at first sort to the top: failed and unreadable files, then files whose text changed after sealing, then verified files with no link; within each group, files with no link come first. Verified, linked rows come last.

- **Integrity**: `verified` means the file matches the seal it carries. Anyone who edits a file can seal it again, so to confirm it is the file that was submitted, compare its payload hash (shown in KNOBE Lens or in Studio's Verify view) with the one you recorded when it was submitted. `verified-body-modified` means the sealed payload still matches its seal, but the readable text (the essay you would read and grade) changed after sealing. The summary above the table counts these separately as *verified but text changed after sealing*, and they sort near the top, just below failed and unreadable files. `failed` means it was altered after sealing. `unreadable` means it is not a sealed file at all (often a plain essay uploaded without sealing).
- **Chain**: `linked` means the file references the assigned spec or journey by exact hash. `no link` means it chains to something else, or to nothing.
- **AI disclosure**: the student's own declaration of what an AI did, quoted from the file. `none declared` is not an anomaly by itself; under a disclosure policy it means the student declared no AI use.
- **Review**: the submission status the student sealed, usually `submitted`.

A `failed`, `verified-body-modified`, `unreadable` or `no link` row is a conversation, not a verdict. An `unreadable` file is often just an essay that was never sealed, which is not an anomaly by itself. The table tells you what the file says about itself; what that means is course policy.

## Exporting and grading

**Download the table as CSV** gives you the same rows for gradebook cross-reference. The CSV contains only what students declared inside their files; no Canvas data enters the page. Grading itself stays in SpeedGrader, where a sealed file displays as plain text.

## Seal a cohort receipt

After a check, **Seal a cohort receipt** (under the table) seals a KNOBE attesting that these files, with these payload hashes, produced these verdicts when you ran the check. Keep it with the course records; in a dispute, it fixes what existed at grading time, and anchoring its single payload hash anywhere with an independent timestamp (an email to yourself, a gradebook note) timestamps the whole batch.

Two things that are normal, not anomalies. Large cohorts produce large receipts: a 500-file check seals in about a second to a file of roughly 200 KB, which is fine for the protocol and for storage. And a resubmission that Canvas renamed (the same bytes as `essay1.knobe.md` arriving again as `essay1-1.knobe.md`) appears as two rows with different file names and identical payload hashes; identical bytes under the identical name are merged into one row.

## One student's history

Drop a single student's files from across the term and press **Chain view**. Each file lists what it builds on and whether the fingerprints match, which is the record you want in a regrade or integrity conversation.

## If you run an AI agent

The same checks run agentically: install `knobe-mcp` (see knobe.org/mcp) in Claude Desktop or any MCP client, point it at the unzipped folder, and ask it to verify the batch and tabulate declarations. The server runs locally, but anything the agent reads through it, including full student text from `knobe_read`, goes to that agent's model and its provider. Use it only where your institution's agreement with that provider covers student records.
