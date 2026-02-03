'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Search,
  Users,
  Building2,
  DollarSign,
  Ticket,
  FileText,
  Calendar,
  Filter,
  SlidersHorizontal,
  Loader2,
  ArrowRight,
  Clock,
  Mail,
  Phone,
  Tag,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { useContacts } from '@/hooks/use-contacts';
import { useCompanies } from '@/hooks/use-companies';
import { useDeals } from '@/hooks/use-deals';

// Search result type configs
const RESULT_TYPES = {
  contact: { icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10', label: 'Contacts' },
  company: { icon: Building2, color: 'text-purple-500', bg: 'bg-purple-500/10', label: 'Companies' },
  deal: { icon: DollarSign, color: 'text-green-500', bg: 'bg-green-500/10', label: 'Deals' },
  ticket: { icon: Ticket, color: 'text-orange-500', bg: 'bg-orange-500/10', label: 'Tickets' },
  task: { icon: FileText, color: 'text-cyan-500', bg: 'bg-cyan-500/10', label: 'Tasks' },
  activity: { icon: Calendar, color: 'text-primary', bg: 'bg-primary/10', label: 'Activities' },
};

function formatCurrency(amount) {
  if (!amount) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
  }).format(amount);
}

function getInitials(firstName, lastName) {
  return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase() || 'U';
}

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [query, setQuery] = useState(initialQuery);
  const [activeTab, setActiveTab] = useState('all');
  const [sortBy, setSortBy] = useState('relevance');

  // Fetch data with search query
  const { data: contactsData, isLoading: contactsLoading } = useContacts({ search: query, limit: 10 });
  const { data: companiesData, isLoading: companiesLoading } = useCompanies({ search: query, limit: 10 });
  const { data: dealsData, isLoading: dealsLoading } = useDeals({ search: query, limit: 10 });

  const contacts = contactsData?.data || [];
  const companies = companiesData?.data || [];
  const deals = dealsData?.data || [];

  const isLoading = contactsLoading || companiesLoading || dealsLoading;

  // Total results count
  const totalResults = contacts.length + companies.length + deals.length;

  // Update URL when query changes
  useEffect(() => {
    if (query) {
      router.replace(`/search?q=${encodeURIComponent(query)}`, { scroll: false });
    }
  }, [query, router]);

  const handleSearch = (e) => {
    e.preventDefault();
    // The query state update will trigger the API calls
  };

  // Filter results by tab
  const getFilteredResults = () => {
    switch (activeTab) {
      case 'contacts':
        return { contacts, companies: [], deals: [] };
      case 'companies':
        return { contacts: [], companies, deals: [] };
      case 'deals':
        return { contacts: [], companies: [], deals };
      default:
        return { contacts, companies, deals };
    }
  };

  const filteredResults = getFilteredResults();

  return (
    <div className="space-y-6 pb-12">
      {/* Search Header */}
      <div className="space-y-4">
        <h1 className="text-2xl font-bold flex items-center gap-3">
          <Search className="h-7 w-7" />
          Search Results
        </h1>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="max-w-2xl">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search contacts, companies, deals..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-12 pr-4 h-12 text-lg"
            />
          </div>
        </form>

        {/* Results Summary */}
        {query && (
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            {isLoading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Searching...
              </span>
            ) : (
              <>
                <span>
                  Found <strong className="text-foreground">{totalResults}</strong> results for "{query}"
                </span>
                <span>•</span>
                <span>{contacts.length} contacts</span>
                <span>•</span>
                <span>{companies.length} companies</span>
                <span>•</span>
                <span>{deals.length} deals</span>
              </>
            )}
          </div>
        )}
      </div>

      {/* Filters and Results */}
      {query && (
        <div className="flex gap-6">
          {/* Sidebar Filters */}
          <div className="w-64 flex-shrink-0 space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Filter Results
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Type</label>
                  <div className="space-y-1">
                    {[
                      { value: 'all', label: 'All Results', count: totalResults },
                      { value: 'contacts', label: 'Contacts', count: contacts.length },
                      { value: 'companies', label: 'Companies', count: companies.length },
                      { value: 'deals', label: 'Deals', count: deals.length },
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setActiveTab(option.value)}
                        className={cn(
                          'w-full flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors',
                          activeTab === option.value
                            ? 'bg-primary text-primary-foreground'
                            : 'hover:bg-muted'
                        )}
                      >
                        <span>{option.label}</span>
                        <Badge variant={activeTab === option.value ? 'secondary' : 'outline'} className="text-xs">
                          {option.count}
                        </Badge>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Sort by</label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="relevance">Relevance</SelectItem>
                      <SelectItem value="newest">Newest first</SelectItem>
                      <SelectItem value="oldest">Oldest first</SelectItem>
                      <SelectItem value="name">Name (A-Z)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Recent Searches */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Recent Searches
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  {['Acme Corp', 'John Doe', 'Enterprise deal', 'support ticket'].map((term) => (
                    <button
                      key={term}
                      onClick={() => setQuery(term)}
                      className="w-full text-left px-2 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results */}
          <div className="flex-1 space-y-6">
            {isLoading ? (
              <Card className="p-12 text-center">
                <Loader2 className="h-8 w-8 mx-auto mb-4 animate-spin text-muted-foreground" />
                <p className="text-muted-foreground">Searching...</p>
              </Card>
            ) : totalResults === 0 ? (
              <Card className="p-12 text-center">
                <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-medium mb-2">No results found</h3>
                <p className="text-muted-foreground mb-4">
                  Try different keywords or check your spelling
                </p>
                <Button variant="outline" onClick={() => setQuery('')}>
                  Clear search
                </Button>
              </Card>
            ) : (
              <>
                {/* Contacts Results */}
                {filteredResults.contacts.length > 0 && (
                  <Card>
                    <CardHeader className="pb-3 flex flex-row items-center justify-between">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Users className="h-5 w-5 text-blue-500" />
                        Contacts
                        <Badge variant="secondary">{filteredResults.contacts.length}</Badge>
                      </CardTitle>
                      <Link href={`/crm/contacts?q=${encodeURIComponent(query)}`} className="text-sm text-primary hover:underline flex items-center gap-1">
                        View all <ArrowRight className="h-3 w-3" />
                      </Link>
                    </CardHeader>
                    <CardContent className="p-0">
                      {filteredResults.contacts.map((contact, index) => (
                        <motion.div
                          key={contact.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.03 }}
                        >
                          <Link
                            href={`/crm/contacts/${contact.id}`}
                            className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors border-b last:border-0"
                          >
                            <Avatar className="h-10 w-10">
                              <AvatarFallback className="bg-blue-500/10 text-blue-600">
                                {getInitials(contact.firstName, contact.lastName)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium">
                                {contact.firstName} {contact.lastName}
                              </p>
                              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                {contact.email && (
                                  <span className="flex items-center gap-1">
                                    <Mail className="h-3 w-3" />
                                    {contact.email}
                                  </span>
                                )}
                                {contact.phone && (
                                  <span className="flex items-center gap-1">
                                    <Phone className="h-3 w-3" />
                                    {contact.phone}
                                  </span>
                                )}
                              </div>
                            </div>
                            {contact.lifecycleStage && (
                              <Badge variant="outline" className="capitalize">
                                {contact.lifecycleStage.toLowerCase()}
                              </Badge>
                            )}
                          </Link>
                        </motion.div>
                      ))}
                    </CardContent>
                  </Card>
                )}

                {/* Companies Results */}
                {filteredResults.companies.length > 0 && (
                  <Card>
                    <CardHeader className="pb-3 flex flex-row items-center justify-between">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Building2 className="h-5 w-5 text-purple-500" />
                        Companies
                        <Badge variant="secondary">{filteredResults.companies.length}</Badge>
                      </CardTitle>
                      <Link href={`/crm/companies?q=${encodeURIComponent(query)}`} className="text-sm text-primary hover:underline flex items-center gap-1">
                        View all <ArrowRight className="h-3 w-3" />
                      </Link>
                    </CardHeader>
                    <CardContent className="p-0">
                      {filteredResults.companies.map((company, index) => (
                        <motion.div
                          key={company.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.03 }}
                        >
                          <Link
                            href={`/crm/companies/${company.id}`}
                            className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors border-b last:border-0"
                          >
                            <div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                              <Building2 className="h-5 w-5 text-purple-500" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium">{company.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {company.industry || 'No industry'} • {company._count?.contacts || 0} contacts
                              </p>
                            </div>
                            {company.website && (
                              <Badge variant="outline">
                                {company.website.replace(/^https?:\/\//, '')}
                              </Badge>
                            )}
                          </Link>
                        </motion.div>
                      ))}
                    </CardContent>
                  </Card>
                )}

                {/* Deals Results */}
                {filteredResults.deals.length > 0 && (
                  <Card>
                    <CardHeader className="pb-3 flex flex-row items-center justify-between">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <DollarSign className="h-5 w-5 text-green-500" />
                        Deals
                        <Badge variant="secondary">{filteredResults.deals.length}</Badge>
                      </CardTitle>
                      <Link href={`/pipeline/deals?q=${encodeURIComponent(query)}`} className="text-sm text-primary hover:underline flex items-center gap-1">
                        View all <ArrowRight className="h-3 w-3" />
                      </Link>
                    </CardHeader>
                    <CardContent className="p-0">
                      {filteredResults.deals.map((deal, index) => (
                        <motion.div
                          key={deal.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.03 }}
                        >
                          <Link
                            href={`/pipeline/deals/${deal.id}`}
                            className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors border-b last:border-0"
                          >
                            <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                              <DollarSign className="h-5 w-5 text-green-500" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium">{deal.title}</p>
                              <p className="text-sm text-muted-foreground">
                                {deal.stage?.name || 'No stage'} • {deal.contact?.firstName} {deal.contact?.lastName}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-green-600">{formatCurrency(deal.value)}</p>
                              <Badge
                                variant="outline"
                                className={cn(
                                  deal.status === 'won' && 'border-green-500 text-green-600',
                                  deal.status === 'lost' && 'border-red-500 text-red-600'
                                )}
                              >
                                {deal.status}
                              </Badge>
                            </div>
                          </Link>
                        </motion.div>
                      ))}
                    </CardContent>
                  </Card>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* No Query State */}
      {!query && (
        <Card className="p-12 text-center">
          <Search className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-30" />
          <h3 className="text-xl font-medium mb-2">Start searching</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            Search across all your contacts, companies, deals, tickets, and more.
            Use <kbd className="px-1.5 py-0.5 bg-muted rounded border text-xs">Cmd/Ctrl + K</kbd> for quick access.
          </p>
        </Card>
      )}
    </div>
  );
}
