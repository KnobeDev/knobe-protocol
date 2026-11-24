Forwarded note: please read the file below before class.
---
title: "Body After Preamble"
spec_version: "1.0"
---

# Body After Preamble

A line of text sits above this file's opening delimiter, so line 1 is not `---` and the file has no frontmatter. A verifier must not search further down for a `---` pair: the opening delimiter is line 1 and nowhere else.

---

The two horizontal rules in this body are ordinary Markdown. They are not
frontmatter delimiters, and the body_hash sealed in the payload covers them.

---

The payload seals a body_hash, and with no frontmatter there is no closing delimiter to locate the body from. Expected status: unreadable, body_verified: omitted, conformance: invalid.

-----BEGIN KNOBE B64-----
eyJhdHRyaWJ1dGlvbiI6eyJzb3VyY2VzIjpbeyJhdXRob3IiOiJKb3NodWEgSG9yaSIsImNvbnRy
aWJ1dGlvbiI6IlRlc3QgdmVjdG9yIGF1dGhvciJ9XX0sImJvZHlfaGFzaCI6ImFhMTk2NDBjOWY4
NjQ4MmE5NDEyYTE3MzkxYzRjZDZiZWQ4NjE4MTdjOGY0MDNiMTQ3MDczNTM2NGI2MjZjMzkiLCJj
b250ZW50X3R5cGUiOiJvcmlnaW5hbCIsImNyZWF0ZWRfZGF0ZSI6IjIwMjYtMTEtMjMiLCJsaWNl
bnNlIjoiQ0MwIDEuMCIsInBheWxvYWRfaGFzaCI6IjJjYTA4NGNjM2Y3NjA5ZjBhNTIxZGE4ZTFh
MzYzNTFjZWY2YzM1M2NjYzhlYThhZTVjMmIwOGI1NzMwZTdhNjEiLCJwcml2YWN5X2xldmVsIjoi
cHVibGljIiwicXVhcmFudGluZV9zdGF0dXMiOiJxdWFyYW50aW5lIiwic3BlY192ZXJzaW9uIjoi
MS4wIiwic3VtbWFyeSI6IlBpbnMgdGhhdCBmcm9udG1hdHRlciBtdXN0IGJlZ2luIG9uIGxpbmUg
MTogd2l0aCBhIGxpbmUgb2YgdGV4dCBhYm92ZSB0aGUgb3BlbmluZyBkZWxpbWl0ZXIgdGhlIGZp
bGUgaGFzIG5vIGZyb250bWF0dGVyLCBhbmQgYSBzZWFsZWQgYm9keV9oYXNoIG1ha2VzIGl0IHVu
cmVhZGFibGUgKHByb3Bvc2VkIEUxNCkuIiwidGl0bGUiOiJCb2R5IEFmdGVyIFByZWFtYmxlIn0=
-----END KNOBE B64-----
