'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Video,
  TrendingUp,
  Award,
  Phone,
  Play,
  Clock,
  CalendarDays,
  Target,
  Brain,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { UnifiedLayout, createStat, createAction } from '@/components/layout/unified';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

// Mock call recordings
const mockRecordings = [
  {
    id: 1,
    title: 'Discovery Call - Acme Corp',
    contact: 'John Smith',
    company: 'Acme Corp',
    duration: '32:15',
    date: '2024-12-20',
    score: 85,
    feedback: 'Great discovery questions, needs work on objection handling',
    highlights: ['Strong rapport', 'Clear next steps'],
    improvements: ['Address budget early', 'Listen more'],
  },
  {
    id: 2,
    title: 'Demo Call - TechStart',
    contact: 'Sarah Johnson',
    company: 'TechStart Inc',
    duration: '45:30',
    date: '2024-12-19',
    score: 92,
    feedback: 'Excellent demo flow, strong close',
    highlights: ['Personalized demo', 'Handled objections well', 'Strong close'],
    improvements: ['Could be more concise'],
  },
  {
    id: 3,
    title: 'Negotiation - Global Industries',
    contact: 'Mike Wilson',
    company: 'Global Industries',
    duration: '28:45',
    date: '2024-12-18',
    score: 78,
    feedback: 'Good negotiation, but gave discount too early',
    highlights: ['Patient approach'],
    improvements: ['Hold on pricing', 'Ask for commitment first'],
  },
];

// Team leaderboard
const teamLeaderboard = [
  { rank: 1, name: 'Sarah Chen', avatar: null, score: 94, calls: 45, improvement: '+12%' },
  { rank: 2, name: 'You', avatar: null, score: 88, calls: 38, improvement: '+8%' },
  { rank: 3, name: 'Mike Johnson', avatar: null, score: 85, calls: 42, improvement: '+5%' },
  { rank: 4, name: 'Lisa Wang', avatar: null, score: 82, calls: 35, improvement: '+15%' },
  { rank: 5, name: 'Tom Brown', avatar: null, score: 79, calls: 28, improvement: '+3%' },
];

// Skills breakdown
const skills = [
  { name: 'Discovery Questions', score: 88, benchmark: 75 },
  { name: 'Active Listening', score: 82, benchmark: 80 },
  { name: 'Objection Handling', score: 75, benchmark: 78 },
  { name: 'Closing Techniques', score: 85, benchmark: 72 },
  { name: 'Product Knowledge', score: 92, benchmark: 85 },
  { name: 'Talk-to-Listen Ratio', score: 70, benchmark: 65 },
];

// Coaching stats
const coachingStats = {
  totalCalls: 38,
  avgScore: 85,
  improvement: 12,
  hoursCoached: 8,
};

export default function CoachingPage() {
  const [activeTab, setActiveTab] = useState('recordings');

  const stats = [
    createStat('Calls', coachingStats.totalCalls, Phone, 'blue'),
    createStat('Avg Score', coachingStats.avgScore, Target, 'green'),
    createStat('Improvement', `+${coachingStats.improvement}%`, TrendingUp, 'purple'),
    createStat('Hours', coachingStats.hoursCoached, Clock, 'orange'),
  ];

  const actions = [
    createAction('Get AI Coaching', Sparkles, () => console.log('ai coaching'), { primary: true }),
  ];

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 80) return 'text-blue-600 bg-blue-100';
    if (score >= 70) return 'text-amber-600 bg-amber-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <UnifiedLayout
      hubId="sales"
      pageTitle="Sales Coaching"
      stats={stats}
      actions={actions}
      fixedMenu={null}
    >
      <div className="p-6 space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="recordings" className="gap-2">
              <Video className="h-4 w-4" />
              Call Recordings
            </TabsTrigger>
            <TabsTrigger value="skills" className="gap-2">
              <Brain className="h-4 w-4" />
              Skills Analysis
            </TabsTrigger>
            <TabsTrigger value="leaderboard" className="gap-2">
              <Award className="h-4 w-4" />
              Leaderboard
            </TabsTrigger>
          </TabsList>

          <TabsContent value="recordings" className="space-y-4 mt-4">
            <div className="space-y-4">
              {mockRecordings.map((recording, index) => (
                <motion.div
                  key={recording.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="p-3 rounded-lg bg-primary/10">
                          <Video className="h-6 w-6 text-primary" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold">{recording.title}</h3>
                            <Badge variant="outline" className={getScoreColor(recording.score)}>
                              Score: {recording.score}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground mb-3">
                            <span>{recording.contact}</span>
                            <span>-</span>
                            <span>{recording.company}</span>
                            <span>-</span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {recording.duration}
                            </span>
                            <span>-</span>
                            <span className="flex items-center gap-1">
                              <CalendarDays className="h-3 w-3" />
                              {new Date(recording.date).toLocaleDateString()}
                            </span>
                          </div>

                          <p className="text-sm mb-3">{recording.feedback}</p>

                          <div className="flex flex-wrap gap-4">
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">Highlights</p>
                              <div className="flex flex-wrap gap-1">
                                {recording.highlights.map((h, idx) => (
                                  <Badge
                                    key={idx}
                                    variant="secondary"
                                    className="text-xs bg-green-50 text-green-700"
                                  >
                                    <CheckCircle2 className="h-3 w-3 mr-1" />
                                    {h}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">Areas to Improve</p>
                              <div className="flex flex-wrap gap-1">
                                {recording.improvements.map((i, idx) => (
                                  <Badge
                                    key={idx}
                                    variant="secondary"
                                    className="text-xs bg-amber-50 text-amber-700"
                                  >
                                    {i}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2">
                          <Button variant="outline" size="sm">
                            <Play className="h-4 w-4 mr-2" />
                            Play
                          </Button>
                          <Button variant="ghost" size="sm">
                            Transcript
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="skills" className="space-y-6 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Skills Breakdown</CardTitle>
                <CardDescription>Your performance vs team benchmark</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {skills.map((skill) => (
                  <div key={skill.name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{skill.name}</span>
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            'font-bold',
                            skill.score >= skill.benchmark ? 'text-green-600' : 'text-amber-600'
                          )}
                        >
                          {skill.score}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          / {skill.benchmark} benchmark
                        </span>
                      </div>
                    </div>
                    <div className="relative h-3 bg-muted rounded-full overflow-hidden">
                      <div
                        className="absolute inset-y-0 left-0 bg-primary rounded-full"
                        style={{ width: `${skill.score}%` }}
                      />
                      <div
                        className="absolute inset-y-0 w-0.5 bg-red-500"
                        style={{ left: `${skill.benchmark}%` }}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <div className="p-3 rounded-lg bg-blue-100">
                    <Sparkles className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-blue-900 mb-1">AI Coaching Recommendation</h3>
                    <p className="text-sm text-blue-800 mb-3">
                      Based on your recent calls, focus on improving your objection handling skills.
                      We recommend practicing responses to pricing and timeline objections.
                    </p>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                      Start Practice Session
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="leaderboard" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-amber-500" />
                  Team Leaderboard
                </CardTitle>
                <CardDescription>Top performers this month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {teamLeaderboard.map((member) => (
                    <div
                      key={member.rank}
                      className={cn(
                        'flex items-center gap-4 p-4 rounded-lg',
                        member.name === 'You'
                          ? 'bg-primary/5 border border-primary/20'
                          : 'hover:bg-muted/50'
                      )}
                    >
                      <div
                        className={cn(
                          'w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm',
                          member.rank === 1
                            ? 'bg-amber-100 text-amber-700'
                            : member.rank === 2
                              ? 'bg-gray-100 text-gray-700'
                              : member.rank === 3
                                ? 'bg-orange-100 text-orange-700'
                                : 'bg-muted text-muted-foreground'
                        )}
                      >
                        {member.rank}
                      </div>
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback>
                          {member.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-medium">{member.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {member.calls} calls analyzed
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">{member.score}</p>
                        <p className="text-sm text-green-600">{member.improvement}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </UnifiedLayout>
  );
}
