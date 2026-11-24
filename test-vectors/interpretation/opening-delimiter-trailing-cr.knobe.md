---
title: "Opening Delimiter Trailing CR"
spec_version: "1.0"
---

# Opening Delimiter Trailing CR

Line 1 of this file is `---` followed by two carriage returns and then a line feed. A delimiter line is `---` once its trailing carriage returns are removed, both when a verifier checks that frontmatter exists and when it locates the body.

---

The two horizontal rules in this body are ordinary Markdown. They are not
frontmatter delimiters, and the body_hash sealed in the payload covers them.

---

The body after the closing delimiter is unchanged since sealing. Expected status: verified, body_verified: yes, conformance: valid.

-----BEGIN KNOBE B64-----
eyJhdHRyaWJ1dGlvbiI6eyJzb3VyY2VzIjpbeyJhdXRob3IiOiJKb3NodWEgSG9yaSIsImNvbnRy
aWJ1dGlvbiI6IlRlc3QgdmVjdG9yIGF1dGhvciJ9XX0sImJvZHlfaGFzaCI6IjUwNzRkNzI4NzNl
MmRhYzdjMDY0YzNlZDA1YmFhODQyZTEyZTRhNTZkNzY3YmQ2OTlhZGNlZmU4MWY1ZTc2MGMiLCJj
b250ZW50X3R5cGUiOiJvcmlnaW5hbCIsImNyZWF0ZWRfZGF0ZSI6IjIwMjYtMTEtMjMiLCJsaWNl
bnNlIjoiQ0MwIDEuMCIsInBheWxvYWRfaGFzaCI6ImIxMjE5MDJmYzlmOGZkYmE0MjQzN2Q5NjVm
N2Q2NWJlNzIzMDcyYzgxZTBkYzM5NjYyOWQzZDBmYzJjNjI2MzAiLCJwcml2YWN5X2xldmVsIjoi
cHVibGljIiwicXVhcmFudGluZV9zdGF0dXMiOiJxdWFyYW50aW5lIiwic3BlY192ZXJzaW9uIjoi
MS4wIiwic3VtbWFyeSI6IlBpbnMgdGhhdCB0cmFpbGluZyBjYXJyaWFnZSByZXR1cm5zIG9uIHRo
ZSBvcGVuaW5nIGRlbGltaXRlciBsaW5lIGFyZSBpZ25vcmVkIHdoZW4gbG9jYXRpbmcgdGhlIGJv
ZHksIGFzIHRoZXkgYXJlIHdoZW4gY2hlY2tpbmcgZm9yIGZyb250bWF0dGVyLCBzbyBhIHNlYWxl
ZCBib2R5X2hhc2ggc3RpbGwgdmVyaWZpZXMgKEUxNCkuIiwidGl0bGUiOiJPcGVuaW5nIERlbGlt
aXRlciBUcmFpbGluZyBDUiJ9
-----END KNOBE B64-----
