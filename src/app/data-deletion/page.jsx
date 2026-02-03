export const metadata = {
  title: 'Data Deletion Request | Nexora CRM',
  description: 'Request deletion of your Facebook and Instagram data from Nexora CRM',
};

export default function DataDeletionPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white shadow-sm rounded-lg p-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">
          Delete Your Facebook/Instagram Data
        </h1>

        <div className="prose prose-gray max-w-none">
          <p className="lead text-lg text-gray-700">
            You can request deletion of your Facebook and Instagram data from Nexora CRM at any
            time.
          </p>

          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 my-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-blue-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  <strong>Important</strong>: This will only delete your social media connection
                  data from Nexora CRM. Your Facebook/Instagram accounts and content will remain
                  unchanged.
                </p>
              </div>
            </div>
          </div>

          <h2>Option 1: Disconnect via Nexora CRM (Recommended)</h2>
          <p>The fastest way to delete your data is directly through your Nexora CRM account:</p>

          <ol>
            <li>
              Log in to your Nexora account at{' '}
              <a href="https://nexoraos.pro" className="text-blue-600 hover:underline">
                https://nexoraos.pro
              </a>
            </li>
            <li>Navigate to Settings → Connected Accounts</li>
            <li>Find Facebook/Instagram in the list of connected accounts</li>
            <li>Click "Disconnect" next to each account</li>
            <li>Confirm the disconnection</li>
          </ol>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4 my-6">
            <h3 className="text-lg font-semibold text-green-800 mt-0">
              What happens when you disconnect:
            </h3>
            <ul className="text-sm text-green-700 mb-0">
              <li>OAuth access tokens are immediately revoked</li>
              <li>Your account connection information is deleted within 30 days</li>
              <li>All scheduled posts to Facebook/Instagram are cancelled</li>
              <li>Historical post analytics are anonymized</li>
              <li>No further posts can be made from Nexora to your accounts</li>
            </ul>
          </div>

          <h2>Option 2: Email Request</h2>
          <p>If you're unable to access your Nexora account, you can email us directly:</p>

          <div className="bg-gray-50 p-6 rounded-lg my-6">
            <p className="font-semibold mb-2">Send an email to:</p>
            <p className="mb-4">
              <a
                href="mailto:privacy@nexoraos.pro?subject=Delete My Facebook Data"
                className="text-blue-600 hover:underline text-lg"
              >
                privacy@nexoraos.pro
              </a>
            </p>

            <p className="font-semibold mb-2">Subject line:</p>
            <p className="mb-4">
              <code className="bg-white px-2 py-1 rounded border text-sm">
                Delete My Facebook Data
              </code>
            </p>

            <p className="font-semibold mb-2">Include in your email:</p>
            <ul className="text-sm text-gray-700">
              <li>Your Nexora CRM account email address</li>
              <li>The Facebook email address you used to connect</li>
              <li>Any Instagram usernames connected (if applicable)</li>
              <li>Reason for deletion (optional)</li>
            </ul>

            <p className="mt-4 text-sm text-gray-600">
              <strong>Response Time</strong>: We will confirm deletion within{' '}
              <strong>48 hours</strong> of receiving your request.
            </p>
          </div>

          <h2>Option 3: Data Deletion Callback (Automatic)</h2>
          <p>
            If you request data deletion directly from Facebook, Meta will automatically notify us
            via a secure callback:
          </p>
          <p>
            <code className="bg-gray-100 px-2 py-1 rounded text-sm">
              https://api.nexoraos.pro/api/v1/webhooks/facebook/data-deletion
            </code>
          </p>
          <p className="text-sm text-gray-600">
            This happens automatically when you delete the Nexora CRM app from your Facebook App
            Settings.
          </p>

          <h2>What Data Is Deleted</h2>
          <p>When you request deletion, we remove the following from our systems:</p>
          <ul>
            <li>
              <strong>OAuth Tokens</strong>: Access and refresh tokens for Facebook/Instagram
              (immediately revoked)
            </li>
            <li>
              <strong>Account Information</strong>: Facebook Page IDs, Instagram account IDs,
              usernames, profile pictures
            </li>
            <li>
              <strong>Scheduled Posts</strong>: Any pending posts scheduled to Facebook/Instagram
            </li>
            <li>
              <strong>Post Metadata</strong>: Information about posts created through Nexora
              (titles, captions, timestamps)
            </li>
            <li>
              <strong>Analytics Data</strong>: Engagement metrics we collected (anonymized or
              deleted)
            </li>
          </ul>

          <h2>What Data Is NOT Deleted</h2>
          <p>The following data remains unchanged:</p>
          <ul>
            <li>
              <strong>Your Facebook/Instagram Accounts</strong>: Your actual Facebook and Instagram
              accounts are not affected
            </li>
            <li>
              <strong>Published Posts</strong>: Posts already published to Facebook/Instagram remain
              on those platforms
            </li>
            <li>
              <strong>Other Nexora Data</strong>: Your CRM data (contacts, deals, emails) remains in
              Nexora unless you delete your entire account
            </li>
          </ul>

          <h2>Deletion Timeline</h2>
          <table className="min-w-full divide-y divide-gray-200 my-6">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Deletion Time
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">OAuth Tokens</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Immediately revoked
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  Scheduled Posts (cancelled)
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Immediately cancelled
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  Account Information
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Within 30 days
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  Database Backups
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Within 90 days
                </td>
              </tr>
            </tbody>
          </table>

          <h2>Confirmation & Tracking</h2>
          <p>After your data is deleted, you'll receive:</p>
          <ul>
            <li>
              <strong>Email Confirmation</strong>: We'll send you an email confirming the deletion
            </li>
            <li>
              <strong>Confirmation Code</strong>: A unique code to track your deletion request
            </li>
            <li>
              <strong>Status Page</strong>: A link to check the status of your deletion (if using
              callback)
            </li>
          </ul>

          <h2>Need Help?</h2>
          <div className="bg-gray-50 p-6 rounded-lg">
            <p className="mb-2">If you have questions about data deletion or need assistance:</p>
            <p className="mb-2">
              <strong>Email</strong>:{' '}
              <a href="mailto:privacy@nexoraos.pro" className="text-blue-600 hover:underline">
                privacy@nexoraos.pro
              </a>
            </p>
            <p className="mb-2">
              <strong>Data Protection Officer</strong>:{' '}
              <a href="mailto:dpo@nexoraos.pro" className="text-blue-600 hover:underline">
                dpo@nexoraos.pro
              </a>
            </p>
            <p className="text-sm text-gray-600">
              <strong>Response Time</strong>: We typically respond within 24-48 hours
            </p>
          </div>

          <h2>Related Pages</h2>
          <ul>
            <li>
              <a href="/privacy" className="text-blue-600 hover:underline">
                Privacy Policy
              </a>{' '}
              - How we collect, use, and protect your data
            </li>
            <li>
              <a href="/terms" className="text-blue-600 hover:underline">
                Terms of Service
              </a>{' '}
              - Our terms and conditions
            </li>
          </ul>

          <div className="mt-12 pt-8 border-t border-gray-200 text-sm text-gray-600">
            <p>This page complies with Meta's data deletion requirements and GDPR regulations.</p>
            <p className="mt-2">© 2026 72orionx Pvt Ltd. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
