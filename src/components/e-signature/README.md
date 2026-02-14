# E-Signature Components

Frontend components for the E-Signature system.

## Components

### 1. SendForSignatureButton

Reusable button component that can be added to any page to send documents for signature.

**Usage:**

```jsx
import { SendForSignatureButton } from '@/components/e-signature/SendForSignatureButton';

// In your component
<SendForSignatureButton
  document={{
    id: quote.id,
    name: quote.quoteNumber,
    pdfUrl: quote.pdfUrl,
  }}
  documentType="QUOTE"
  onSuccess={(signatureRequest) => {
    console.log('Signature request created:', signatureRequest);
    // Refresh data or update UI
  }}
/>;
```

**Props:**

- `document` (object, required): Document information
  - `id`: Document ID
  - `name` or `quoteNumber` or `number`: Document name/number
  - `pdfUrl` or `documentUrl`: PDF URL
- `documentType` (string, optional): Type of document (default: 'QUOTE')
  - Options: 'QUOTE', 'CONTRACT', 'PROPOSAL', 'INVOICE', 'NDA', 'AGREEMENT'
- `onSuccess` (function, optional): Callback when signature request is created

## Integration Examples

### Quote Detail Page

```jsx
// In nexora-web/src/app/(dashboard)/pipeline/quotes/[id]/page.jsx

import { SendForSignatureButton } from '@/components/e-signature/SendForSignatureButton';

export default function QuoteDetailPage({ params }) {
  const [quote, setQuote] = useState(null);

  return (
    <div>
      {/* ... existing quote details ... */}

      <div className="flex gap-2">
        <Button onClick={handleEdit}>Edit Quote</Button>
        <Button onClick={handleDownload}>Download PDF</Button>

        {/* Add E-Signature button */}
        <SendForSignatureButton
          document={{
            id: quote.id,
            quoteNumber: quote.quoteNumber,
            pdfUrl: quote.pdfUrl,
          }}
          documentType="QUOTE"
          onSuccess={() => {
            toast.success('Signature request sent!');
          }}
        />
      </div>
    </div>
  );
}
```

### Contract Page

```jsx
import { SendForSignatureButton } from '@/components/e-signature/SendForSignatureButton';

<SendForSignatureButton
  document={{
    id: contract.id,
    name: contract.contractNumber,
    pdfUrl: contract.documentUrl,
  }}
  documentType="CONTRACT"
/>;
```

### Invoice Page

```jsx
import { SendForSignatureButton } from '@/components/e-signature/SendForSignatureButton';

<SendForSignatureButton
  document={{
    id: invoice.id,
    number: invoice.invoiceNumber,
    pdfUrl: invoice.pdfUrl,
  }}
  documentType="INVOICE"
/>;
```

## Pages

### Public Signing Page

**URL:** `/sign/[requestId]/[token]`

This is the public page where signers view and sign documents. No authentication required.

**Features:**

- Document preview (PDF iframe)
- Signature canvas (draw signature)
- Signer information display
- Success/error states
- Already signed detection

### Settings Management Page

**URL:** `/settings/e-signatures`

Authenticated page for managing signature requests.

**Features:**

- Create new signature requests
- View all requests (table view)
- Filter by status
- View request details with signer status
- Cancel pending requests
- Statistics cards (Total, Pending, In Progress, Completed)

## API Endpoints Used

### Protected (Requires Auth)

- `POST /api/v1/e-signature/requests` - Create signature request
- `GET /api/v1/e-signature/requests` - List all requests
- `GET /api/v1/e-signature/requests/:id` - Get request details
- `POST /api/v1/e-signature/requests/:id/cancel` - Cancel request

### Public (No Auth)

- `GET /api/v1/e-signature/sign/:requestId/:token` - View document to sign
- `POST /api/v1/e-signature/sign/:requestId/:token` - Submit signature
- `POST /api/v1/e-signature/sign/:requestId/:token/decline` - Decline to sign

## Dependencies

- `react-signature-canvas` - For signature drawing
- `@/components/ui/*` - shadcn/ui components
- `sonner` - Toast notifications
- `lucide-react` - Icons

## Installation

The frontend components are ready to use. Make sure you have:

1. ✅ Installed dependencies:

   ```bash
   cd nexora-web
   pnpm add react-signature-canvas
   ```

2. ✅ Backend API endpoints are running

3. ✅ Navigation link added to settings sidebar

## TODO

- [ ] Add PDF upload component (currently requires manual URL input)
- [ ] Add signature field positioning (visual PDF editor)
- [ ] Add email templates customization UI
- [ ] Add signature history/audit log viewer
- [ ] Add bulk signature requests
- [ ] Add signature request templates
- [ ] Add mobile-optimized signing page
- [ ] Add signature reminder scheduling UI
