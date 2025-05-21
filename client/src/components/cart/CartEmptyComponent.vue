<template>
  <div class="text-center py-16 flex flex-col items-center justify-center h-[70vh]">
    <svg
      class="mx-auto h-24 w-24 text-gray-400"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="1"
        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
      />
    </svg>
    <h3 class="mt-4 text-3xl font-bold text-gray-900">Your cart is empty</h3>
    <p class="mt-2 text-xl text-gray-500">Explore our products and add to your cart</p>
    <div class="mt-8">
      <RouterLink
        :to="{ name: 'home' }"
        class="inline-flex items-center rounded-md bg-red-600 px-5 py-3 text-3xl font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
      >
        <svg
          class="-ml-1 mr-3 h-8 w-8"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"
          />
        </svg>
        Shop now
      </RouterLink>
    </div>
  </div>
</template>
