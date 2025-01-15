
'use client';

import { Card, Title, Text, Metric, Flex, AreaChart } from '@tremor/react';
import { User, GameSession } from '@/types';

interface UserDetailProps {
  user: User | null;
  sessions: GameSession[];
}

export default function UserDetail({ user, sessions }: UserDetailProps) {
  if (!user) {
    return null;
  }

  // Process sessions data for chart
  const chartData = sessions.map(session => ({
    date: new Date(session.startTime).toLocaleDateString(),
    score: session.score
  }));

  return (
    <Card className="mt-4">
      <Flex>
        <div>
          <Title>User Profile</Title>
          <Text>@{user.username}</Text>
          <Text>{user.firstName} {user.lastName}</Text>
        </div>
        <div>
          <Text>Best Scores</Text>
          <Metric>Daily: {user.dailyBestScore}</Metric>
          <Metric>Weekly: {user.weeklyBestScore}</Metric>
          <Metric>All-time: {user.bestScore}</Metric>
        </div>
      </Flex>

      <Title className="mt-4">Score History</Title>
      <AreaChart
        className="mt-4 h-48"
        data={chartData}
        index="date"
        categories={["score"]}
        colors={["blue"]}
      />
    </Card>
  );
}
