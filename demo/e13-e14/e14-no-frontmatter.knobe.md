
# E14: frontmatter removed

The frontmatter block is gone. The body's own `---` rules are the only `---` lines left.

---

## The edit made after sealing

The frontmatter block, both delimiters included, was deleted.

---

## Why it is here

This file demonstrates a case in the proposed rulings E13 and E14
(KnobeOne/knobe-protocol#22). The text above was sealed with a body_hash,
so a verifier that finds the body in the right place reports it as
unchanged. The two horizontal rules are part of the sealed body.

-----BEGIN KNOBE B64-----
eyJhdHRyaWJ1dGlvbiI6eyJzb3VyY2VzIjpbeyJhdXRob3IiOiJKb3NodWEgSG9yaSIsImNvbnRy
aWJ1dGlvbiI6ImF1dGhvciJ9XX0sImJvZHlfaGFzaCI6ImRkMjk2YzIwMmIzNDgzMDExN2I3ZTNk
MWExNjAzMWFkYzM0MzMyYTk3ZDEzNTdmZDBlOGIxNmJkODdmMTE2NTAiLCJjb250ZW50X3R5cGUi
OiJvcmlnaW5hbCIsImNyZWF0ZWRfZGF0ZSI6IjIwMjYtMTEtMjMiLCJpZGVudGl0eV9zdGF0dXMi
OiJkZWNsYXJlZCIsImxpY2Vuc2UiOiJDQzAgMS4wIiwicGF5bG9hZF9oYXNoIjoiZGFlNGE4MTgz
NTg3N2E5N2VmNDBkMjczM2I0YmY1Y2E4MmVmNDgzZTZkMDc1MmFjMWIyZjk0NTNkZWQ5NmI0MCIs
InByaXZhY3lfbGV2ZWwiOiJwdWJsaWMiLCJxdWFyYW50aW5lX3N0YXR1cyI6InF1YXJhbnRpbmUi
LCJzcGVjX3ZlcnNpb24iOiIxLjAiLCJzdW1tYXJ5IjoiVGhlIGZyb250bWF0dGVyIGJsb2NrIGlz
IGdvbmUuIFRoZSBib2R5J3Mgb3duIGAtLS1gIHJ1bGVzIGFyZSB0aGUgb25seSBgLS0tYCBsaW5l
cyBsZWZ0LiBEZW1vIGZpbGUgZm9yIHRoZSBwcm9wb3NlZCBydWxpbmdzIEUxMyBhbmQgRTE0LiIs
InRpdGxlIjoiRTE0OiBmcm9udG1hdHRlciByZW1vdmVkIn0=
-----END KNOBE B64-----
