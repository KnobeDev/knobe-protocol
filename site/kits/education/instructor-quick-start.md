# Instructor quick-start

One page: define an assignment sequence, seal it, and post it to Canvas. No installation, no account, no JSON. Time: about five minutes for a three-step sequence.

## What you are making

One plain-text file, called a journey. Its readable half is a syllabus-ready description of your assignment sequence. Its sealed half carries the same steps in machine-readable form, so a student who loads the file gets a submission form already set up with your policies. The file verifies: anyone can check that it matches the seal it carries. To confirm it is the file you sealed, compare its payload hash with the one you kept.

## Build the journey

1. Open **knobe.org/studio** in any browser and choose the **Journey** tab.
2. Fill in the course name, term, and your name.
3. Add a step for each stage of the assignment. For each step, set:
   - **Who seals it**: you, the student, a TA, or a peer reviewer.
   - **Kind of work**: reading, assignment spec, student writing, feedback, revision, and so on.
   - **AI policy**: not allowed, allowed with disclosure, required with disclosure, or not applicable. Add detail in your own words; students see it verbatim.
   - **Builds on**: check the earlier steps this one draws from.
4. Watch the preview below the form. That text is what students will read.

## Seal your own steps first (recommended)

For steps you author, such as a reading or the assignment spec, use **Seal this step now**. Studio walks you through sealing that file, then records its fingerprint (a hash) inside the journey. Student submissions will chain to it exactly, and the TA's batch check can verify the chain. You can skip this; steps referenced by title only still work, with title-matching instead of hash-matching.

## Seal and post

1. Press **Seal the journey** and download the file.
2. In Canvas, create the assignment. Attach the journey file and paste the description (Studio gives you a copy button for it).
3. Set the submission type to **File Uploads**. If you restrict file types, the allowed list must include `md`. This is the one setup detail that fails silently if missed.

## Changing the sequence mid-term

Load your existing journey file into the Journey tab, edit, and reseal. The new file records that it supersedes the old one. Submissions students already made still chain to the version that was actually assigned to them; that is the record behaving correctly.

## The rest of the kit

The TA guide covers batch checking. The student handout is written to be attached to the assignment as-is. Two sealed example journeys, one AI-disclosed and one AI-prohibited, load into Studio unchanged if you want to start from a working sequence. The loop on one page (loop-on-one-page.html) is a printable visual guide to the whole cycle; it works as a workshop handout or a syllabus insert.

Everything runs inside the browser page. Student work is never transmitted to any server, including ours.
