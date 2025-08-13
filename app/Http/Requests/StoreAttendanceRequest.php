<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreAttendanceRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->check() && auth()->user()->isEmployee();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'type' => 'required|in:clock_in,clock_out',
            'latitude' => 'required|numeric|between:-90,90',
            'longitude' => 'required|numeric|between:-180,180',
            'address' => 'nullable|string|max:500',
            'notes' => 'nullable|string|max:1000',
            'device_info' => 'nullable|array',
            'location_data' => 'nullable|array',
            'face_verified' => 'boolean',
            'face_confidence' => 'nullable|numeric|between:0,1',
        ];
    }

    /**
     * Get custom error messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'type.required' => 'Jenis absensi harus diisi.',
            'type.in' => 'Jenis absensi tidak valid.',
            'latitude.required' => 'Lokasi latitude harus diisi.',
            'latitude.numeric' => 'Latitude harus berupa angka.',
            'latitude.between' => 'Latitude tidak valid.',
            'longitude.required' => 'Lokasi longitude harus diisi.',
            'longitude.numeric' => 'Longitude harus berupa angka.',
            'longitude.between' => 'Longitude tidak valid.',
            'address.max' => 'Alamat maksimal 500 karakter.',
            'notes.max' => 'Catatan maksimal 1000 karakter.',
            'face_confidence.numeric' => 'Confidence score harus berupa angka.',
            'face_confidence.between' => 'Confidence score harus antara 0 dan 1.',
        ];
    }
}