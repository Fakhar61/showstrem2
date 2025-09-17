import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

interface CreativeProducerFormProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  name: string;
  email: string;
  artistOrLabel: string;
  discussion: string;
}

export const CreativeProducerForm: React.FC<CreativeProducerFormProps> = ({
  isOpen,
  onClose,
}) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    artistOrLabel: '',
    discussion: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.artistOrLabel) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // For demo purposes, we'll simulate sending data
      // In a real implementation, you would send this to your webhook/email service
      const submissionData = {
        ...formData,
        timestamp: new Date().toISOString(),
        source: 'Artist Dashboard - Creative Producer Inquiry',
      };

      console.log('Creative Producer Inquiry Submitted:', submissionData);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast({
        title: "Inquiry Sent",
        description: "Your message has been sent to our Creative Producer team. We'll be in touch within 24 hours.",
      });

      // Reset form and close
      setFormData({
        name: '',
        email: '',
        artistOrLabel: '',
        discussion: '',
      });
      onClose();

    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Submission Error",
        description: "There was an issue sending your inquiry. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-surface border-border">
        <DialogHeader>
          <DialogTitle className="text-xl font-light tracking-wide">
            Start the Conversation
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-sm font-light text-foreground">
                Name *
              </Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="mt-1 bg-background border-border text-foreground"
                required
              />
            </div>

            <div>
              <Label htmlFor="email" className="text-sm font-light text-foreground">
                Email *
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="mt-1 bg-background border-border text-foreground"
                required
              />
            </div>

            <div>
              <Label htmlFor="artistOrLabel" className="text-sm font-light text-foreground">
                Artist or Label Name *
              </Label>
              <Input
                id="artistOrLabel"
                type="text"
                value={formData.artistOrLabel}
                onChange={(e) => handleInputChange('artistOrLabel', e.target.value)}
                className="mt-1 bg-background border-border text-foreground"
                required
              />
            </div>

            <div>
              <Label htmlFor="discussion" className="text-sm font-light text-foreground">
                What would you like to discuss? (Optional)
              </Label>
              <Textarea
                id="discussion"
                value={formData.discussion}
                onChange={(e) => handleInputChange('discussion', e.target.value)}
                className="mt-1 bg-background border-border text-foreground resize-none"
                rows={3}
                placeholder="Tell us about your next content project, timeline, creative vision, or any specific questions you have..."
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 font-light"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 font-light"
              style={{ backgroundColor: '#3A6BFF' }}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Sending...' : 'Send Inquiry'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};