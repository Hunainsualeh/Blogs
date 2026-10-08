# Owner and legal verification checklist

These items could not be verified from the codebase and need a decision or check by the site owner.

## Before applying to AdSense

* AdSense approval cannot be guaranteed by site design. Google reviews the site content and the site must follow the AdSense program policies and Google Publisher Policies.
* The sample articles are templated placeholders. Replace them with original, useful articles and hide the samples in Admin, Settings. Thin or repetitive content is a common reason for rejection.
* Contact page: no Contact Us page existed in this repository, so a minimal `/contact` page listing the contact emails was added. If the live site already has a Contact Us page with a form, keep that page and remove `app/(site)/contact` before deploying so it is not replaced.
* Contact emails default to `contact@globalinsightsdaily.com`. Confirm the mailbox exists or change it in Admin, Settings.
* Site URL defaults to `https://globalinsightsdaily.com`. Confirm it, and set `NEXT_PUBLIC_SITE_URL` if different.

## Consent and privacy

* Visitors in the EEA, UK and Switzerland require a Google-certified consent management platform for personalized ads. Create and publish the European regulations message in AdSense, Privacy and messaging. The footer link "Privacy and ad choices" reopens that message once the AdSense script is active.
* The Privacy Policy was drafted from what the site does today: contributor submission data, an anonymous article view counter, no third-party analytics, Google AdSense when enabled. Have it reviewed by a legal adviser, especially the sections on data rights, US state laws, retention periods and international transfers.
* If Google Analytics or any other tracker is added later, update the policy and the consent setup.
* Retention wording for rejected submissions is general. Confirm the real practice.

## Editorial claims

* About Us and Write for Us describe a review process, a 5 to 7 working day response target and editorial standards. Confirm the team can honor them.
* No team members, company history or credentials were invented. Add real ones if wanted.

## Hosting

* Add Upstash Redis variables (or a persistent disk) before using the admin area in production, otherwise saved content is lost on redeploy.
* Set `ADMIN_PASSWORD` to a strong unique value.
* Deleted or unpublished article URLs return the not found page with a noindex tag.
