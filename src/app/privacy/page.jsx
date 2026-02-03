export const metadata = {
  title: 'Privacy Policy | Nexora CRM',
  description: 'Privacy Policy for Nexora CRM - How we collect, use, and protect your data',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white shadow-sm rounded-lg p-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy - Nexora CRM</h1>

        <div className="text-sm text-gray-600 mb-8">
          <p>
            <strong>Effective Date</strong>: February 3, 2026
          </p>
          <p>
            <strong>Last Updated</strong>: February 3, 2026
          </p>
        </div>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Introduction</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Nexora CRM ("we," "us," or "our") is operated by 72orionx Pvt Ltd. We are committed to
              protecting your privacy and handling your personal information transparently and
              securely.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              This Privacy Policy explains how we collect, use, store, and protect your information
              when you use Nexora CRM, available at{' '}
              <a href="https://nexoraos.pro" className="text-blue-600 hover:underline">
                https://nexoraos.pro
              </a>{' '}
              (the "Service").
            </p>
            <p className="text-gray-700 leading-relaxed">
              By using our Service, you agree to the collection and use of information in accordance
              with this policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Information We Collect</h2>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">1. Account Information</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              When you create a Nexora CRM account, we collect:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mb-6">
              <li>
                <strong>Name and Email</strong>: For account creation and communication
              </li>
              <li>
                <strong>Company Information</strong>: Company name, industry, size
              </li>
              <li>
                <strong>Phone Number</strong>: Optional, for account recovery and notifications
              </li>
              <li>
                <strong>Password</strong>: Stored securely using industry-standard encryption
                (bcrypt)
              </li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">2. CRM Data</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              When you use our CRM features, we collect:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mb-6">
              <li>
                <strong>Contact Information</strong>: Names, emails, phone numbers, addresses of
                your customers
              </li>
              <li>
                <strong>Deal Information</strong>: Sales pipeline data, deal values, stages
              </li>
              <li>
                <strong>Communication Records</strong>: Emails, WhatsApp messages, SMS sent via our
                platform
              </li>
              <li>
                <strong>Notes and Tasks</strong>: Internal notes, tasks, reminders related to your
                business
              </li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">3. Social Media Data</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              When you connect your social media accounts to Nexora CRM, we collect and store:
            </p>

            <h4 className="text-lg font-medium text-gray-800 mb-2">
              From Facebook & Instagram (via Meta Graph API):
            </h4>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mb-4">
              <li>
                <strong>Account Information</strong>: Profile name, profile picture, account ID,
                page ID
              </li>
              <li>
                <strong>Page Information</strong>: Facebook Page name, page access permissions
              </li>
              <li>
                <strong>Instagram Business Account</strong>: Username, profile picture, follower
                count
              </li>
              <li>
                <strong>OAuth Access Tokens</strong>: Encrypted tokens to post on your behalf
              </li>
              <li>
                <strong>Post Content</strong>: Text, images, videos you create and schedule via our
                platform
              </li>
              <li>
                <strong>Engagement Metrics</strong>: Likes, comments, shares, reactions for posts
                published through Nexora
              </li>
            </ul>

            <h4 className="text-lg font-medium text-gray-800 mb-2">From Other Social Platforms:</h4>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mb-4">
              <li>LinkedIn: Profile info, company pages, post data, engagement stats</li>
              <li>Twitter/X: Account info, tweet data, engagement metrics</li>
              <li>TikTok: Creator account info, video content</li>
              <li>YouTube: Channel info, video metadata</li>
            </ul>

            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 my-4">
              <p className="text-blue-800 font-semibold">
                Important: We do NOT access your social media accounts without your explicit
                authorization via OAuth. We only access data necessary to provide the social media
                management features you've requested.
              </p>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">4. Usage Information</h3>
            <p className="text-gray-700 leading-relaxed mb-4">We automatically collect:</p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>
                <strong>Log Data</strong>: IP address, browser type, pages visited, time spent
              </li>
              <li>
                <strong>Device Information</strong>: Operating system, device type, unique device
                identifiers
              </li>
              <li>
                <strong>Feature Usage</strong>: Which features you use, how often, interaction
                patterns
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">How We Use Your Information</h2>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">Core CRM Functions</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mb-6">
              <li>
                <strong>Manage Your Contacts</strong>: Store and organize customer information
              </li>
              <li>
                <strong>Sales Pipeline</strong>: Track deals, forecast revenue, manage tasks
              </li>
              <li>
                <strong>Communication</strong>: Send emails, WhatsApp messages, SMS to your contacts
              </li>
              <li>
                <strong>Reporting</strong>: Generate analytics and insights about your business
              </li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">Social Media Management</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mb-6">
              <li>
                <strong>Account Connection</strong>: Authenticate and link your social media
                accounts
              </li>
              <li>
                <strong>Content Publishing</strong>: Post text, images, videos to your connected
                platforms
              </li>
              <li>
                <strong>Scheduling</strong>: Store and publish content at your specified times
              </li>
              <li>
                <strong>Analytics</strong>: Display engagement metrics (likes, comments, shares) for
                your posts
              </li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">Service Improvement</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>
                <strong>Product Development</strong>: Understand feature usage to improve Nexora
              </li>
              <li>
                <strong>Bug Fixes</strong>: Identify and resolve technical issues
              </li>
              <li>
                <strong>Customer Support</strong>: Respond to your inquiries and support requests
              </li>
              <li>
                <strong>Security</strong>: Detect and prevent fraud, abuse, security incidents
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              How We Store and Protect Your Information
            </h2>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">Data Security Measures</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              We implement industry-standard security practices:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mb-6">
              <li>
                <strong>Encryption in Transit</strong>: All data transmitted via HTTPS/TLS
              </li>
              <li>
                <strong>Encryption at Rest</strong>: Sensitive data (passwords, OAuth tokens)
                encrypted using AES-256
              </li>
              <li>
                <strong>Database Security</strong>: PostgreSQL with access controls and regular
                backups
              </li>
              <li>
                <strong>Access Controls</strong>: Role-based access, multi-tenant isolation
              </li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">Data Retention</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>
                <strong>Active Accounts</strong>: Data retained as long as your account is active
              </li>
              <li>
                <strong>Inactive Accounts</strong>: Data retained for 90 days after account closure
              </li>
              <li>
                <strong>Social Media Tokens</strong>: Expired tokens deleted after 90 days
              </li>
              <li>
                <strong>Scheduled Posts</strong>: Deleted after successful publication or 30 days
                after scheduling
              </li>
            </ul>
          </section>

          <h2>How We Share Your Information</h2>

          <h3>We Do NOT Sell Your Data</h3>
          <p>
            We will never sell, rent, or trade your personal information to third parties for
            marketing purposes.
          </p>

          <h3>Limited Sharing Scenarios</h3>

          <h4>1. Social Media Platforms (Your Explicit Consent)</h4>
          <p>
            When you connect a social media account and publish content, we share post content and
            OAuth tokens with the platforms you've authorized (Facebook, Instagram, LinkedIn,
            Twitter, TikTok, YouTube).
          </p>
          <p>
            This sharing is <strong>essential</strong> to provide social media posting features and
            occurs <strong>only with your explicit authorization</strong> via OAuth.
          </p>

          <h4>2. Service Providers</h4>
          <p>We use trusted third-party providers to operate our service:</p>
          <ul>
            <li>Cloud Hosting: Railway, VPS providers</li>
            <li>Email Delivery: For transactional emails (password resets, notifications)</li>
            <li>Payment Processing: For billing (we do NOT store credit card data)</li>
          </ul>
          <p>All providers sign Data Processing Agreements (DPAs) and comply with GDPR.</p>

          <h4>3. Legal Requirements</h4>
          <p>
            We may disclose your information if required by law to comply with subpoenas, court
            orders, or legal obligations.
          </p>

          <h2>Your Rights and Choices</h2>

          <h3>Access and Portability</h3>
          <ul>
            <li>
              <strong>View Your Data</strong>: Access all your data via your account dashboard
            </li>
            <li>
              <strong>Export Data</strong>: Download your CRM data, contacts, posts in CSV/JSON
              format
            </li>
          </ul>

          <h3>Deletion</h3>
          <ul>
            <li>
              <strong>Delete Account</strong>: Request full account deletion from Settings → Account
            </li>
            <li>
              <strong>Data Deletion Timeline</strong>:
              <ul>
                <li>Account data deleted within 30 days</li>
                <li>Backups purged within 90 days</li>
                <li>Social media tokens revoked immediately</li>
              </ul>
            </li>
          </ul>

          <h3>Social Media Account Disconnection</h3>
          <ul>
            <li>
              <strong>Disconnect Anytime</strong>: Remove social media connections from Settings →
              Connected Accounts
            </li>
            <li>
              <strong>What Happens</strong>:
              <ul>
                <li>OAuth tokens immediately revoked</li>
                <li>Scheduled posts cancelled</li>
                <li>Account information deleted within 30 days</li>
              </ul>
            </li>
          </ul>

          <h3>European Users (GDPR Rights)</h3>
          <p>If you're in the EU/EEA, you have additional rights:</p>
          <ul>
            <li>
              <strong>Right to Access</strong>: Request a copy of your personal data
            </li>
            <li>
              <strong>Right to Rectification</strong>: Correct inaccurate or incomplete data
            </li>
            <li>
              <strong>Right to Erasure</strong>: Request deletion of your data ("right to be
              forgotten")
            </li>
            <li>
              <strong>Right to Data Portability</strong>: Receive your data in a machine-readable
              format
            </li>
            <li>
              <strong>Right to Object</strong>: Object to processing based on legitimate interests
            </li>
          </ul>
          <p>
            To exercise these rights, email us at{' '}
            <a href="mailto:privacy@nexoraos.pro" className="text-blue-600 hover:underline">
              privacy@nexoraos.pro
            </a>
          </p>

          <h2>Social Media-Specific Privacy Information</h2>

          <h3>Facebook & Instagram Data Handling</h3>

          <h4>What We Access:</h4>
          <ul>
            <li>Profile information (name, picture, page ID)</li>
            <li>Facebook Pages you manage</li>
            <li>Instagram Business accounts linked to your Pages</li>
            <li>OAuth access tokens (encrypted)</li>
          </ul>

          <h4>What We Do:</h4>
          <ul>
            <li>Display account information in your dashboard</li>
            <li>Publish posts/images/videos you create</li>
            <li>Retrieve engagement metrics for posts published via Nexora</li>
          </ul>

          <h4>What We DON'T Do:</h4>
          <ul>
            <li>We do NOT access your personal timeline or private messages</li>
            <li>We do NOT post without your explicit action</li>
            <li>We do NOT access friend lists or private information</li>
            <li>We do NOT share your data with advertisers</li>
          </ul>

          <h4>Data Deletion:</h4>
          <p>You can disconnect your Facebook/Instagram accounts anytime. When disconnected:</p>
          <ul>
            <li>OAuth tokens are immediately revoked</li>
            <li>Account information deleted within 30 days</li>
            <li>Scheduled posts cancelled</li>
            <li>Historical analytics anonymized</li>
          </ul>
          <p>
            We implement Meta's data deletion callback URL to handle deletion requests:{' '}
            <code className="bg-gray-100 px-2 py-1 rounded text-sm">
              https://api.nexoraos.pro/api/v1/webhooks/facebook/data-deletion
            </code>
          </p>

          <h2>Children's Privacy</h2>
          <p>
            Nexora CRM is not intended for children under 13 (or 16 in the EU). We do not knowingly
            collect personal information from children. If you believe we have collected data from a
            child, please contact us immediately at{' '}
            <a href="mailto:privacy@nexoraos.pro" className="text-blue-600 hover:underline">
              privacy@nexoraos.pro
            </a>
            , and we will delete it promptly.
          </p>

          <h2>International Data Transfers</h2>
          <p>
            <strong>Primary Location</strong>: Our servers are located in India.
          </p>
          <p>
            Your data may be transferred to and processed in countries outside India. We ensure
            appropriate safeguards are in place:
          </p>
          <ul>
            <li>Standard Contractual Clauses for EU data transfers</li>
            <li>Data Processing Agreements with all international providers</li>
          </ul>

          <h2>Changes to This Privacy Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of any changes
            by:
          </p>
          <ul>
            <li>Updating the "Last Updated" date at the top</li>
            <li>Email notification for material changes</li>
            <li>Prominent notice on our website</li>
          </ul>

          <h2>Contact Us</h2>
          <p>
            If you have questions, concerns, or requests regarding this Privacy Policy or your data:
          </p>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="mb-2">
              <strong>Email</strong>:{' '}
              <a href="mailto:privacy@nexoraos.pro" className="text-blue-600 hover:underline">
                privacy@nexoraos.pro
              </a>
            </p>
            <p className="mb-2">
              <strong>Support</strong>:{' '}
              <a href="https://nexoraos.pro/support" className="text-blue-600 hover:underline">
                https://nexoraos.pro/support
              </a>
            </p>
            <p className="mb-2">
              <strong>Data Protection Officer</strong>:{' '}
              <a href="mailto:dpo@nexoraos.pro" className="text-blue-600 hover:underline">
                dpo@nexoraos.pro
              </a>
            </p>
            <p>
              <strong>Company</strong>: 72orionx Pvt Ltd, India
            </p>
          </div>
          <p className="mt-4 text-sm text-gray-600">
            <strong>Response Time</strong>: We will respond to privacy inquiries within 30 days (or
            72 hours for urgent security matters).
          </p>

          <h2>Additional Resources</h2>
          <ul>
            <li>
              <a href="/terms" className="text-blue-600 hover:underline">
                Terms of Service
              </a>
            </li>
            <li>
              <a href="/data-deletion" className="text-blue-600 hover:underline">
                Data Deletion Request
              </a>
            </li>
          </ul>

          <h2>Compliance</h2>
          <p>Nexora CRM complies with:</p>
          <ul>
            <li>GDPR (General Data Protection Regulation) - EU</li>
            <li>India's IT Act, 2000 - Indian data protection laws</li>
            <li>Meta Platform Terms - For Facebook/Instagram integration</li>
            <li>Google API Services User Data Policy - For YouTube integration</li>
            <li>LinkedIn Developer Terms - For LinkedIn integration</li>
            <li>Twitter Developer Agreement - For Twitter/X integration</li>
            <li>TikTok Developer Terms - For TikTok integration</li>
          </ul>

          <h2>Consent</h2>
          <p>By using Nexora CRM, you consent to:</p>
          <ul>
            <li>Collection and use of information as described in this policy</li>
            <li>Use of cookies and tracking technologies</li>
            <li>International data transfers where necessary</li>
            <li>Sharing with social media platforms for authorized features</li>
          </ul>
          <p>
            You can withdraw consent at any time by disconnecting social media accounts, deleting
            your account, or contacting us at{' '}
            <a href="mailto:privacy@nexoraos.pro" className="text-blue-600 hover:underline">
              privacy@nexoraos.pro
            </a>
          </p>

          <div className="mt-12 pt-8 border-t border-gray-200 text-sm text-gray-600">
            <p>
              <strong>This Privacy Policy is effective as of February 3, 2026.</strong>
            </p>
            <p>
              <strong>Last Reviewed</strong>: February 3, 2026
            </p>
            <p>
              <strong>Version</strong>: 1.0
            </p>
            <p className="mt-4">© 2026 72orionx Pvt Ltd. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
