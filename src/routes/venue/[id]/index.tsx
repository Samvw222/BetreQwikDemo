import { component$ } from "@builder.io/qwik";
import { routeLoader$, Link } from "@builder.io/qwik-city";
import { type Venue } from "~/routes";

export const useVenue = routeLoader$(async (requestEvent) => {
  const res = await fetch(`http://localhost:3000/venues/${requestEvent.params.id}`);
  return await res.json() as Venue;
});

export default component$(() => {
  const signal = useVenue();
  const venue = signal.value;

  return (
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="mb-6">
        <Link href="/" class="text-blue-600 hover:text-blue-800 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
          </svg>
          Back to Venues
        </Link>
      </div>

      <div class="bg-white rounded-lg shadow-lg overflow-hidden">
        <div class="aspect-[3/1] bg-cover bg-center relative"
          style={`background-image:url('${venue.image}')`}>
          <div class="absolute inset-0 bg-black bg-opacity-40"></div>
          <div class="absolute bottom-0 left-0 right-0 p-8 text-white">
            <div class="flex items-center gap-4">
              <h1 class="text-4xl font-bold">{venue.name}</h1>
              <span class="px-4 py-2 rounded-full bg-white bg-opacity-20 text-sm">
                {venue.type.charAt(0).toUpperCase() + venue.type.slice(1)}
              </span>
            </div>
            <p class="mt-2 text-lg opacity-90">{venue.address}</p>
          </div>
        </div>

        <div class="p-8">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="md:col-span-2">
              <h2 class="text-2xl font-semibold mb-4">About</h2>
              <p class="text-gray-600 leading-relaxed">{venue.description}</p>

              <div class="mt-8">
                <h2 class="text-2xl font-semibold mb-4">Specialties</h2>
                <div class="flex flex-wrap gap-2">
                  {venue.specialties.map((specialty) => (
                    <span key={specialty} class="px-4 py-2 rounded-full bg-blue-100 text-blue-800">
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div class="bg-gray-50 rounded-lg p-6">
              <h2 class="text-xl font-semibold mb-4">Visiting Hours</h2>
              <p class="text-gray-600">{venue.hours}</p>

              <div class="mt-6">
                <h3 class="font-semibold mb-2">Location</h3>
                <p class="text-gray-600">{venue.address}</p>
              </div>

              <div class="mt-6">
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(venue.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-block w-full px-4 py-2 bg-blue-600 text-white text-center rounded hover:bg-blue-700 transition-colors"
                >
                  Get Directions
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});