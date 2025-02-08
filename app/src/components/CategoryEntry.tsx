import { Text } from '@mantine/core';

import './CategoryEntry.css';

export default function CategoryEntry({ title }: { title: string }) {
  return (
    <div className="categoryEntry-content">
        <Text c="white" fw={650} size="sm">{title}</Text>
    </div>
  )
}
