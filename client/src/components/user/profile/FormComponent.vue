<template>
  <div class="w-full max-w-3/4">
    <h1 class="text-3xl sm:text-4xl font-bold mb-6 text-gray-800">User Profile</h1>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-white rounded-xl shadow-sm overflow-hidden md:col-span-1">
        <div class="p-6">
          <h2 class="text-2xl font-semibold mb-4 text-gray-800">Profile Picture</h2>
          <div class="flex flex-col items-center mt-[4rem]">
            <AvatarComponent />
            <button
              class="inline-flex text-xl items-end mt-2 px-4 py-2 border-2 border-red-500 text-red-500 rounded-lg font-medium hover:bg-red-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
            >
              <PencilSquareIcon class="h-6 w-6 mr-2" />
              Change Picture
            </button>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm overflow-hidden md:col-span-2">
        <div class="p-6 sm:p-8">
          <div class="flex justify-between items-start mb-4">
            <div>
              <h2 class="text-2xl font-semibold text-gray-800">Personal Information</h2>
              <p class="text-lg text-gray-500">Detailed information about your account</p>
            </div>
            <button
              class="inline-flex text-xl items-center px-3 py-1.5 border-2 border-red-500 text-red-500 rounded-lg font-medium hover:bg-red-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
            >
              <PencilSquareIcon class="h-5 w-5 mr-1.5" />
              Edit
            </button>
          </div>

          <div class="mt-6 space-y-6 divide-y divide-gray-100">
            <div class="flex items-start pt-2">
              <EnvelopeIcon class="h-6 w-6 mr-4 text-red-500 mt-0.5 flex-shrink-0" />
              <div>
                <p class="text-lg font-medium text-gray-500">Email</p>
                <p class="text-xl text-gray-900 mt-1">{{ user!.email }}</p>
              </div>
            </div>

            <div class="flex items-start pt-6">
              <UserIcon class="h-6 w-6 mr-4 text-red-500 mt-0.5 flex-shrink-0" />
              <div>
                <p class="text-lg font-medium text-gray-500">Full Name</p>
                <p class="text-xl text-gray-900 mt-1">{{ user!.fullName || 'Not updated' }}</p>
              </div>
            </div>

            <div class="flex items-start pt-6">
              <PhoneIcon class="h-6 w-6 mr-4 text-red-500 mt-0.5 flex-shrink-0" />
              <div>
                <p class="text-lg font-medium text-gray-500">Phone Number</p>
                <p class="text-xl text-gray-900 mt-1">
                  {{ user!.phoneNumber || 'Not updated' }}
                </p>
              </div>
            </div>

            <div class="flex items-start pt-6">
              <MapPinIcon class="h-6 w-6 mr-4 text-red-500 mt-0.5 flex-shrink-0" />
              <div>
                <p class="text-lg font-medium text-gray-500">Address</p>
                <p class="text-xl text-gray-900 mt-1">{{ user!.address || 'Not updated' }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  PencilSquareIcon,
  EnvelopeIcon,
  MapPinIcon,
  PhoneIcon,
  UserIcon,
} from '@heroicons/vue/24/outline'
import { useAuthStore } from '@/stores'
import AvatarComponent from '@/components/atoms/user/AvatarComponent.vue'

const authStore = useAuthStore()
const user = authStore.user as NonNullable<typeof authStore.user>
</script>
