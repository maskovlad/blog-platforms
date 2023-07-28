
interface DateProps {
  dateString: string;
}

export default function Date({ dateString }: DateProps) {

  // return <time dateTime={dateString}>{format(date, "LLL d, yyyy")}</time>;
  return "time";
}
