import { CheckCircleIcon } from "@heroicons/react/20/solid";
import { FC, ReactNode } from "react";

/**
 * Publication Subscription Success
 * @overview Status: Live
 */

interface PublicationSubscriptionSuccessProps {
  children: ReactNode;
  title: string;
  description: string;
}

const PublicationSubscriptionSuccess: FC<PublicationSubscriptionSuccessProps> = ({
  children,
  title,
  description,
}) => (
  <div className="flex min-h-[90dvh] flex-col items-center justify-center gap-6 p-4.5 sm:gap-8">
    <div className="flex flex-col items-center gap-y-6">
      <CheckCircleIcon className="size-[72px] text-green-600" />
      <div className="space-y-3 text-center sm:w-96">
        <h2 className="text-black dark:text-white">{title}</h2>
        <p className="text-balance text-sm text-dim">{description}</p>
      </div>
    </div>

    {children}
  </div>
);

export default PublicationSubscriptionSuccess;
