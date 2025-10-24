import TripDetailPage from "@/components/PageSuggestion";

export default function SuggestionDetail({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen bg-gradient bg-white">
      <TripDetailPage id={params.id} />
    </div>
  );
}