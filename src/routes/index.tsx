import { Resource, component$, useResource$, useSignal, useTask$ } from "@builder.io/qwik";
import { Link, type DocumentHead } from "@builder.io/qwik-city";

export interface Venue {
  id: number;
  name: string;
  address: string;
  image: string;
  description: string;
  type: string;
  specialties: string[];
  hours: string;
}

export default component$(() => {
  const searchTerm = useSignal('');
  const searchTermDebounce = useSignal('');
  const filterType = useSignal('all');

  const venueList = useResource$<Venue[]>(async ({track}) => {
    track(() => searchTermDebounce.value);
    track(() => filterType.value);
    const res = await fetch('http://localhost:3000/venues?q=' + searchTerm.value);
    const venues = await res.json() as Venue[];
    return filterType.value === 'all' 
      ? venues 
      : venues.filter(venue => venue.type === filterType.value);
  });

  useTask$(({track, cleanup}) => {
    const value = track(() => searchTerm.value);
    const id = setTimeout(() => (searchTermDebounce.value = value), 200);
    cleanup(() => clearTimeout(id));
  });

  return (
    <>
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="flex flex-col md:flex-row justify-between items-center pb-8 gap-4">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Art & Culture Guide</h1>
            <p class="mt-2 text-gray-600">Discover amazing galleries and museums</p>
          </div>
          <div class="w-full md:w-auto flex flex-col sm:flex-row gap-4">
            <select
              class="rounded p-2 border border-gray-300"
              value={filterType.value}
              onChange$={(e) => filterType.value = (e.target as HTMLSelectElement).value}
            >
              <option value="all">All Venues</option>
              <option value="gallery">Art Galleries</option>
              <option value="museum">Museums</option>
            </select>
            <input
              id="search"
              type="text"
              class="rounded p-2 border border-gray-300 w-full sm:w-64"
              placeholder="Search venues..."
              onInput$={(e) => searchTerm.value = (e.target as HTMLInputElement).value}
            />
          </div>
        </div>

        <Resource
          value={venueList}
          onPending={() => <div class="text-center py-8">Loading venues...</div>}
          onResolved={(venues) => (
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {venues.map((venue) => (
                <div key={venue.id} class="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  <div 
                    class="aspect-[4/3] bg-cover bg-center" 
                    style={`background-image:url('${venue.image}')`}
                  />
                  <div class="p-6">
                    <div class="flex items-center justify-between">
                      <h3 class="text-xl font-semibold text-gray-900">{venue.name}</h3>
                      <span class="px-3 py-1 text-sm rounded-full bg-gray-100 text-gray-800">
                        {venue.type}
                      </span>
                    </div>
                    <p class="mt-2 text-gray-600">{venue.address}</p>
                    <div class="mt-2">
                      <p class="text-sm text-gray-500">{venue.hours}</p>
                    </div>
                    <div class="mt-4 flex flex-wrap gap-2">
                      {venue.specialties.map((specialty) => (
                        <span key={specialty} class="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                          {specialty}
                        </span>
                      ))}
                    </div>
                    <Link 
                      class="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors" 
                      href={`/venue/${venue.id}`}
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        />
      </div>
    </>
  );
});

export const head: DocumentHead = {
  title: "Art & Culture Guide - Galleries and Museums",
  meta: [
    {
      name: "description",
      content: "Discover amazing art galleries and museums in your area. Browse through our curated collection of cultural venues.",
    },
  ],
};
