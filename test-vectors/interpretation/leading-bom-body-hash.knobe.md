---
title: "Leading BOM With Body Hash"
spec_version: "1.0"
---

# Leading BOM With Body Hash

This file begins with a UTF-8 byte-order mark (EF BB BF) before the opening `---`, as some editors save files. A verifier skips one leading byte-order mark both when it checks that frontmatter exists and when it locates the body.

---

The two horizontal rules in this body are ordinary Markdown. They are not
frontmatter delimiters, and the body_hash sealed in the payload covers them.

---

The body after the closing delimiter is unchanged since sealing. Expected status: verified, body_verified: yes, conformance: valid.

-----BEGIN KNOBE B64-----
eyJhdHRyaWJ1dGlvbiI6eyJzb3VyY2VzIjpbeyJhdXRob3IiOiJKb3NodWEgSG9yaSIsImNvbnRy
aWJ1dGlvbiI6IlRlc3QgdmVjdG9yIGF1dGhvciJ9XX0sImJvZHlfaGFzaCI6IjI5YTJmY2JmM2U3
NDA5NTYwNDYwODYwZTcwNGViOWM2OTIwNzZiZjE5NmRmNTJiMjIwODkxYmE5NzNjZmJlNGIiLCJj
b250ZW50X3R5cGUiOiJvcmlnaW5hbCIsImNyZWF0ZWRfZGF0ZSI6IjIwMjYtMTEtMjMiLCJsaWNl
bnNlIjoiQ0MwIDEuMCIsInBheWxvYWRfaGFzaCI6IjdjYTg3OTkxZTJlOWI1MWFlOGYyNGJmMzRl
NzNiZmY0Nzc5YTQ0MDYzYTUwMmE5YmYxYjJjODg4NmIwZGUzZjgiLCJwcml2YWN5X2xldmVsIjoi
cHVibGljIiwicXVhcmFudGluZV9zdGF0dXMiOiJxdWFyYW50aW5lIiwic3BlY192ZXJzaW9uIjoi
MS4wIiwic3VtbWFyeSI6IlBpbnMgdGhhdCBvbmUgbGVhZGluZyBVVEYtOCBieXRlLW9yZGVyIG1h
cmsgaXMgc2tpcHBlZCB3aGVuIGxvY2F0aW5nIHRoZSBib2R5LCBhcyBpdCBpcyB3aGVuIGNoZWNr
aW5nIGZvciBmcm9udG1hdHRlciwgc28gYSBzZWFsZWQgYm9keV9oYXNoIHN0aWxsIHZlcmlmaWVz
IChFMTQpLiIsInRpdGxlIjoiTGVhZGluZyBCT00gV2l0aCBCb2R5IEhhc2gifQ==
-----END KNOBE B64-----
