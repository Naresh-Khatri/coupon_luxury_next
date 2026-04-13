import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy policy - CouponLuxury",
  alternates: { canonical: "https://www.couponluxury.com/privacy-policy" },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen w-screen bg-[#ebf8ff] pb-10 md:pt-24">
      <div className="mx-auto w-full max-w-[1240px] px-10 py-24">
        <h1 className="mb-5 text-4xl font-extrabold text-brand-900 md:mb-10 md:text-6xl">
          Privacy Policy
        </h1>
        <p className="mb-5">
          Keeping your personal information secure and private is one of our
          highest priorities. The terms and conditions of our website apply to
          the use of our website. Together with our website terms and
          conditions, this policy outlines users&#39; fundamental rights. Here
          are some details about how we will treat your personal data.
        </p>
        <h2 className="text-2xl">INFORMATION WE MAY COLLECT FROM YOU</h2>
        <ul className="mb-10 mt-5 list-disc pl-6">
          <li>
            It is possible for us to collect any or all of the following
            information: contact information, relationship information, location
            information, and analytics information.
          </li>
          <li>
            Although you are free not to participate in such surveys, we may ask
            for your information only for research purposes.
          </li>
          <li>
            Secure online communications are ensured using SSL certificates and
            customer information is kept confidential
          </li>
        </ul>

        <h2 className="text-2xl">
          COUPONLUXURY OFFERS NEWSLETTERS AND ALERT SUBSCRIPTIONS. HOW WILL IT
          WORK?
        </h2>
        <ul className="mb-10 mt-5 list-disc pl-6">
          <li>
            Through our mailers, we will communicate with you about coupon
            codes, freebies, and other products and services we think you will
            find interesting.
          </li>
          <li>
            Based on your preferences, we may send you information about other
            websites that we believe would be of interest to you.
          </li>
          <li>
            Alternatively, you can email us at contact@couponluxury.com for any
            questions related to gift cards. To unsubscribe from offer emails,
            click on the unsubscribe link in the footer of the email.
          </li>
        </ul>
        <Link href="https://www.couponluxury.com" className="mb-5 block">
          <span className="text-brand-900">www.couponluxury.com</span>
        </Link>
      </div>
    </div>
  );
}
