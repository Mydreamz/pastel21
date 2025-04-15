
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface AccountSettingsProps {
  userData: any;
}

const AccountSettings = ({ userData }: AccountSettingsProps) => {
  return (
    <div className="pt-4">
      <div className="space-y-4">
        <div>
          <label className="text-sm text-gray-400 mb-1 block">Name</label>
          <Input value={userData.name} className="bg-white/5 border-white/10 text-white" readOnly />
        </div>
        
        <div>
          <label className="text-sm text-gray-400 mb-1 block">Email</label>
          <Input value={userData.email} className="bg-white/5 border-white/10 text-white" readOnly />
        </div>
        
        <div className="pt-4">
          <Button variant="outline" className="w-full border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/10">
            Update Profile
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;
