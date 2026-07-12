import { motion } from 'framer-motion';

function LegalPage({ title, lastUpdated, sections }) {
  return (
    <div className="pt-32 pb-20 max-w-3xl mx-auto px-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl font-bold mb-2">{title}</h1>
        <p className="text-muted text-sm mb-10">Last updated: {lastUpdated}</p>
        <div className="space-y-8">
          {sections.map((section) => (
            <div key={section.heading}>
              <h2 className="text-xl font-black mb-3 text-zaa-orange">{section.heading}</h2>
              <p className="text-secondary leading-relaxed">{section.content}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

export function PrivacyPolicyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      lastUpdated="January 2024"
      sections={[
        { heading: '1. Information We Collect', content: 'We collect information you provide directly to us, including your name, email address, phone number, nationality, passport details (for visa and booking purposes), and payment information when you create an account, make a booking, or apply for visa assistance.' },
        { heading: '2. How We Use Your Information', content: 'We use your information to process bookings, facilitate visa applications, communicate with you about your trips, send booking confirmations and receipts, improve our services, and send promotional offers (which you can opt out of at any time).' },
        { heading: '3. Data Sharing', content: 'We share your information with trusted third parties only as necessary to fulfil your bookings — including hotels, tour operators, airlines, and visa authorities. We never sell your personal data to advertisers.' },
        { heading: '4. Data Security', content: 'We implement industry-standard security measures, including 256-bit SSL encryption, bcrypt password hashing, and secure payment processing via Stripe, to protect your personal and financial information.' },
        { heading: '5. Your Rights', content: 'You have the right to access, correct, or delete your personal data at any time. Contact us at zenoafricaadventures@gmail.com to exercise these rights.' },
        { heading: '6. Cookies', content: 'We use cookies to maintain your session, remember your preferences, and analyse site usage to improve our services.' },
        { heading: '7. Contact Us', content: 'For any privacy-related questions, please contact us at zenoafricaadventures@gmail.com or call 0674 448 795.' },
      ]}
    />
  );
}

export function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      lastUpdated="January 2024"
      sections={[
        { heading: '1. Acceptance of Terms', content: 'By accessing and using the Zeno Africa Adventures website and booking services, you agree to be bound by these Terms of Service and our Privacy Policy.' },
        { heading: '2. Booking & Payment', content: 'A deposit (typically 30-40% of the total package price) is required to secure your booking. The remaining balance is due 30 days before your travel date unless otherwise specified. All prices are listed in USD unless stated otherwise.' },
        { heading: '3. Cancellations', content: 'Cancellation refunds are calculated based on the time remaining before travel: 90% refund if cancelled more than 60 days before travel, 50% if 31-60 days, 25% if 15-30 days, and no refund within 14 days of travel.' },
        { heading: '4. Visa Services', content: 'Visa assistance is provided on a consultancy basis. While we strive to ensure successful applications, final visa approval rests with the relevant government authorities and is not guaranteed by Zeno Africa Adventures.' },
        { heading: '5. Travel Insurance', content: 'We strongly recommend all travellers purchase comprehensive travel insurance covering medical emergencies, trip cancellation, and lost luggage. Travel insurance is not included in package prices unless explicitly stated.' },
        { heading: '6. Liability', content: 'Zeno Africa Adventures acts as an intermediary between travellers and third-party service providers (hotels, airlines, tour operators). We are not liable for circumstances beyond our control, including natural disasters, political instability, or third-party service failures.' },
        { heading: '7. Changes to Itineraries', content: 'We reserve the right to make reasonable changes to itineraries due to weather, safety concerns, or operational requirements, while maintaining the overall quality and value of your experience.' },
      ]}
    />
  );
}

export function RefundPolicyPage() {
  return (
    <LegalPage
      title="Refund Policy"
      lastUpdated="January 2024"
      sections={[
        { heading: '1. Deposit Refunds', content: 'Deposits are partially refundable based on the cancellation timeline outlined in our Terms of Service. Deposits for gorilla trekking permits and other third-party reservations may be non-refundable due to supplier policies.' },
        { heading: '2. Cancellation Timeline', content: 'More than 60 days before travel: 90% refund. 31-60 days before travel: 50% refund. 15-30 days before travel: 25% refund. Less than 14 days before travel: No refund.' },
        { heading: '3. Refund Processing Time', content: 'Approved refunds are processed within 5-10 business days to the original payment method. Bank transfers may take additional time depending on your financial institution.' },
        { heading: '4. Visa Service Fees', content: 'Visa consultancy service fees are non-refundable once the application process has begun, as this covers our specialists\' time and effort. Government visa fees are subject to the respective embassy\'s refund policies.' },
        { heading: '5. Force Majeure', content: 'In the event of cancellations due to circumstances beyond our control (natural disasters, pandemics, government travel bans), we will work with you to reschedule your trip or provide credit for future travel where possible.' },
        { heading: '6. How to Request a Refund', content: 'To request a refund, log into your dashboard, navigate to "My Bookings", and select "Cancel Booking" on the relevant reservation. Alternatively, contact our support team at zenoafricaadventures@gmail.com.' },
      ]}
    />
  );
}
