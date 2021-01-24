import Skeleton from "react-loading-skeleton";

import Container from "@/components/container";
import Templates from "@/components/templates";

import { getTemplates } from "@/lib/swr-hooks";

export default function EntriesPage() {
  const { templateData, isLoading } = getTemplates();

  if (isLoading) {
    return (
      <div>
        <Container>
          <Skeleton width={180} height={24} />
          <Skeleton height={48} />
          <div className="my-4" />
          <Skeleton width={180} height={24} />
          <Skeleton height={48} />
          <div className="my-4" />
          <Skeleton width={180} height={24} />
          <Skeleton height={48} />
        </Container>
      </div>
    );
  }

  return (
    <div>
      <Container>
        <Templates templates={templateData} />
      </Container>
    </div>
  );
}
