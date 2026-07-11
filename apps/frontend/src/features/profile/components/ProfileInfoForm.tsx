import React, { useEffect, useRef, useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared_components/ui/avatar';
import { Button } from '@/shared_components/ui/button';
import { Card } from '@/shared_components/ui/card';
import { Input } from '@/shared_components/ui/input';
import { Label } from '@/shared_components/ui/label';
import { Textarea } from '@/shared_components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared_components/ui/select';

import { Camera, MapPin, Phone, User2 } from 'lucide-react';

import type { UserProfileResponse } from '@/features/profile/types/profile.type';
import { useUpdateBasicProfileMutation } from '@/features/profile/services/profile.service';

interface ProfileInfoFormProps {
  initialProfile: UserProfileResponse | null;
}

export function ProfileInfoForm({ initialProfile }: ProfileInfoFormProps) {
  const { user } = useAuthStore();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const { mutate, isPending } = useUpdateBasicProfileMutation();

  const [phoneNumber, setPhoneNumber] = useState('');
  const [gender, setGender] = useState<'MALE' | 'FEMALE' | 'OTHER' | null>(null);
  const [dob, setDob] = useState('');
  const [address, setAddress] = useState('');
  const [bio, setBio] = useState('');

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');

  const fallbackLetter = user?.username?.charAt(0).toUpperCase() ?? 'U';

  useEffect(() => {
    if (!initialProfile) return;

    setPhoneNumber(initialProfile.phoneNumber ?? '');

    setGender(initialProfile.profile?.gender ?? null);
    setDob(initialProfile.profile?.dob ?? '');
    setAddress(initialProfile.profile?.address ?? '');
    setBio(initialProfile.profile?.bio ?? '');

    if (initialProfile.avatarUrl) {
      setImagePreview(initialProfile.avatarUrl);
    }
  }, [initialProfile]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setSelectedFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    mutate({
      phoneNumber,
      avatarFile: selectedFile,
      gender,
      dob: dob || null,
      address: address || null,
      bio: bio || null,
    });
  };

  return (
    <Card className="border-0 bg-transparent shadow-none">
      <form onSubmit={handleSubmit} className="space-y-8">

        {/* Avatar */}

        <div
          className="flex flex-col gap-5 rounded-2xl border border-slate-200 bg-white p-5 sm:flex-row sm:items-center">

          <div className="relative mx-auto sm:mx-0">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="group relative"
            >
              <Avatar className="h-24 w-24 border-2 border-slate-200 ring-4 ring-white shadow">
                <AvatarImage src={imagePreview} />
                <AvatarFallback className="bg-slate-900 text-2xl font-semibold text-white">
                  {fallbackLetter}
                </AvatarFallback>
              </Avatar>

              <div
                className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 transition group-hover:opacity-100">
                <Camera className="h-5 w-5 text-white" />
              </div>
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={handleFileChange}
            />
          </div>

          <div className="flex-1 text-center sm:text-left">
            <h3 className="font-semibold">Ảnh đại diện</h3>
            <p className="mt-1 text-sm text-slate-500">
              JPG hoặc PNG, tối đa 5MB.
            </p>
          </div>
        </div>

        {/* Form */}

        <div className="grid gap-5 md:grid-cols-2">

          {/* Phone */}

          <div className="space-y-2">
            <Label>Số điện thoại</Label>

            <div className="relative">
              <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <Input
                className="pl-10"
                disabled={isPending}
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>
          </div>

          {/* Gender */}

          <div className="space-y-2">
            <Label>Giới tính</Label>

            <Select
              value={gender ?? ''}
              onValueChange={(value) =>
                setGender(value as 'MALE' | 'FEMALE' | 'OTHER')
              }
            >
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Chọn giới tính" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="MALE">Nam</SelectItem>
                <SelectItem value="FEMALE">Nữ</SelectItem>
                <SelectItem value="OTHER">Khác</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* DOB */}

          <div className="space-y-2">
            <Label>Ngày sinh</Label>

            <Input
              type="date"
              className="h-11"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
            />
          </div>

        </div>

        {/* Address */}

        <div className="space-y-2">
          <Label>Địa chỉ</Label>

          <div className="relative">
            <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-400" />

            <Input
              className="pl-10"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Nhập địa chỉ..."
            />
          </div>
        </div>

        {/* Bio */}

        <div className="space-y-2">
          <Label>Giới thiệu bản thân</Label>

          <div className="relative">
            <User2 className="absolute left-3 top-3 h-4 w-4 text-slate-400" />

            <Textarea
              className="min-h-32 pl-10"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Viết vài dòng giới thiệu..."
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={isPending}
            className="h-11 rounded-xl px-6"
          >
            {isPending ? 'Đang lưu...' : 'Lưu thay đổi'}
          </Button>
        </div>
      </form>
    </Card>
  );
}
