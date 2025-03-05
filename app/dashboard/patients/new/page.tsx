"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "../../../../components/ui/Button"
import { Input } from "../../../../components/ui/Input"

export default function NewPatientPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    dateofbirth: "",
    gender: "",
    height: "",
    weight: "",
    address: "",
    city: "",
    state: "",
    zipcode: "",
    emergencycontactname: "",
    emergencycontactphone: "",
    emergencycontactrelation: "",
    medicalhistory: "",
    medications: "",
    allergies: "",
    dietaryrestrictions: "",
    goals: "",
    notes: "",
  })

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // In a real app, you would send the data to your API
      console.log("Submitting patient data:", formData)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Redirect to patients list on success
      router.push("/dashboard/patients")
    } catch (error) {
      console.error("Error creating patient:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center">
          <Link href="/dashboard/patients" className="mr-2 text-sm text-neon-blue hover:text-neon-blue/80">
            ← Back to Patients
          </Link>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Add New Patient</h1>
        <p className="text-gray-600">Enter the patient's information below</p>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div>
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Personal Information</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Input
                label="First Name"
                name="firstname"
                value={formData.firstname}
                onChange={handleChange}
                required
                variant="neonBlue"
                className="bg-white"
              />

              <Input
                label="Last Name"
                name="lastname"
                value={formData.lastname}
                onChange={handleChange}
                required
                variant="neonBlue"
                className="bg-white"
              />

              <Input
                label="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                variant="neonBlue"
                className="bg-white"
              />

              <Input
                label="Phone"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                variant="neonBlue"
                className="bg-white"
              />

              <Input
                label="Date of Birth"
                type="date"
                name="dateofbirth"
                value={formData.dateofbirth}
                onChange={handleChange}
                required
                variant="neonBlue"
                className="bg-white"
              />

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-neon-blue focus:outline-none focus:ring-2 focus:ring-neon-blue"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Non-binary">Non-binary</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>

              <Input
                label="Height (in/cm)"
                name="height"
                value={formData.height}
                onChange={handleChange}
                variant="neonBlue"
                className="bg-white"
              />

              <Input
                label="Weight (lbs/kg)"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                variant="neonBlue"
                className="bg-white"
              />
            </div>
          </div>

          {/* Address */}
          <div>
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Address</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <Input
                  label="Street Address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  variant="neonPurple"
                  className="bg-white"
                />
              </div>

              <Input
                label="City"
                name="city"
                value={formData.city}
                onChange={handleChange}
                variant="neonPurple"
                className="bg-white"
              />

              <Input
                label="State/Province"
                name="state"
                value={formData.state}
                onChange={handleChange}
                variant="neonPurple"
                className="bg-white"
              />

              <Input
                label="ZIP/Postal Code"
                name="zipcode"
                value={formData.zipcode}
                onChange={handleChange}
                variant="neonPurple"
                className="bg-white"
              />
            </div>
          </div>

          {/* Emergency Contact */}
          <div>
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Emergency Contact</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Input
                label="Name"
                name="emergencycontactname"
                value={formData.emergencycontactname}
                onChange={handleChange}
                variant="neonPink"
                className="bg-white"
              />

              <Input
                label="Phone"
                type="tel"
                name="emergencycontactphone"
                value={formData.emergencycontactphone}
                onChange={handleChange}
                variant="neonPink"
                className="bg-white"
              />

              <Input
                label="Relationship"
                name="emergencycontactrelation"
                value={formData.emergencycontactrelation}
                onChange={handleChange}
                variant="neonPink"
                className="bg-white"
              />
            </div>
          </div>

          {/* Medical Information */}
          <div>
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Medical Information</h2>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Medical History</label>
                <textarea
                  name="medicalhistory"
                  value={formData.medicalhistory}
                  onChange={handleChange}
                  rows={3}
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-neon-green focus:outline-none focus:ring-2 focus:ring-neon-green"
                  placeholder="Any relevant medical history..."
                ></textarea>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Current Medications</label>
                <textarea
                  name="medications"
                  value={formData.medications}
                  onChange={handleChange}
                  rows={2}
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-neon-green focus:outline-none focus:ring-2 focus:ring-neon-green"
                  placeholder="List current medications..."
                ></textarea>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Allergies</label>
                <textarea
                  name="allergies"
                  value={formData.allergies}
                  onChange={handleChange}
                  rows={2}
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-neon-green focus:outline-none focus:ring-2 focus:ring-neon-green"
                  placeholder="List any allergies..."
                ></textarea>
              </div>
            </div>
          </div>

          {/* Nutritional Information */}
          <div>
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Nutritional Information</h2>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Dietary Restrictions</label>
                <textarea
                  name="dietaryrestrictions"
                  value={formData.dietaryrestrictions}
                  onChange={handleChange}
                  rows={3}
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-neon-blue focus:outline-none focus:ring-2 focus:ring-neon-blue"
                  placeholder="Any dietary restrictions or preferences..."
                ></textarea>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Goals</label>
                <textarea
                  name="goals"
                  value={formData.goals}
                  onChange={handleChange}
                  rows={3}
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-neon-blue focus:outline-none focus:ring-2 focus:ring-neon-blue"
                  placeholder="Patient's nutritional and health goals..."
                ></textarea>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Additional Notes</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={3}
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-neon-blue focus:outline-none focus:ring-2 focus:ring-neon-blue"
                  placeholder="Any additional notes..."
                ></textarea>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-4">
            <Button type="button" variant="ghost" onClick={() => router.push("/dashboard/patients")}>
              Cancel
            </Button>

            <Button type="submit" variant="solidNeonGreen" isLoading={isSubmitting}>
              Create Patient
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
