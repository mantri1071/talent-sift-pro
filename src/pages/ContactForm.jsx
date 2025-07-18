
import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from "@/components/ui/use-toast"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ContactForm = () => {
  const { toast } = useToast()

  const handleSubmit = (e) => {
    e.preventDefault();
    toast({
      title: "🚧 Feature Not Implemented 🚧",
      description: "This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
    })
  }

  return (
    <div className="relative bg-slate-900 min-h-screen flex items-center justify-center font-['Inter']">
       <div className="absolute inset-0 bg-grid-slate-700/[0.2] [mask-image:linear-gradient(to_bottom,white_5%,transparent_100%)]"></div>
       <div className="absolute top-1/2 left-1/2 w-[40rem] h-[40rem] bg-indigo-600/20 rounded-full blur-[10rem] -translate-x-1/2 -translate-y-1/2"></div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        className="relative max-w-5xl w-full mx-auto bg-slate-900/70 backdrop-blur-sm border border-slate-700/50 rounded-2xl shadow-2xl shadow-indigo-500/10"
      >
        <div className="grid md:grid-cols-2">
          <div className="p-8 md:p-12">
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Get in Touch</h1>
              <p className="mt-3 text-slate-400">Contact us for a quote, help or to join the team.</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="first-name" className="text-slate-300">First name</Label>
                  <Input id="first-name" placeholder="John" className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last-name" className="text-slate-300">Last name</Label>
                  <Input id="last-name" placeholder="Doe" className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-300">Email</Label>
                <Input type="email" id="email" placeholder="john.doe@example.com" className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone-number" className="text-slate-300">Phone number <span className="text-slate-500">(Optional)</span></Label>
                <Input id="phone-number" placeholder="+1 (555) 000-0000" className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="how-did-you-find-us" className="text-slate-300">How did you find us?</Label>
                <Select>
                    <SelectTrigger id="how-did-you-find-us" className="bg-slate-800 border-slate-700 text-white">
                        <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700 text-white">
                        <SelectItem value="google">Google</SelectItem>
                        <SelectItem value="social-media">Social Media</SelectItem>
                        <SelectItem value="friend">Friend / Colleague</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message" className="text-slate-300">Message</Label>
                <Textarea id="message" placeholder="Your message..." rows={4} className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500" />
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox id="privacy-policy" className="mt-1 border-slate-600 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600" />
                <div className="grid gap-1.5 leading-none">
                     <label htmlFor="privacy-policy" className="text-sm font-medium text-slate-400 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        You agree to our <a href="#" className="font-semibold text-indigo-400 hover:underline" onClick={(e) => {e.preventDefault(); handleSubmit(e)}}>privacy policy</a>.
                    </label>
                </div>
              </div>

              <Button type="submit" className="w-full text-lg font-semibold py-6">
                Let's talk
              </Button>
            </form>
          </div>
          <div className="bg-slate-800/50 rounded-r-2xl p-8 md:p-12 flex flex-col justify-center">
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="bg-indigo-600/20 p-3 rounded-full">
                  <Mail className="w-6 h-6 text-indigo-400" />
                </div>
                <div>
                  <p className="text-lg font-semibold text-white">hello@horizons.ai</p>
                  <p className="text-slate-400">Email us for general inquiries</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-indigo-600/20 p-3 rounded-full">
                  <Phone className="w-6 h-6 text-indigo-400" />
                </div>
                <div>
                  <p className="text-lg font-semibold text-white">+1 (555) 123-4567</p>
                  <p className="text-slate-400">Call us for immediate assistance</p>
                </div>
              </div>
            </div>
            <div className="mt-12">
                <img  alt="A world map with connection lines, symbolizing global reach and communication" className="w-full h-auto opacity-30" src="https://images.unsplash.com/photo-1532366384837-2c7c719f455d" />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ContactForm;
  