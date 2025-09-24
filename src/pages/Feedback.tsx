import React from "react";
import PageLayout from '@/components/PageLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
	Form,
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
} from '@/components/ui/form';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import { apiFetch } from '@/lib/api';

const formSchema = z.object({
	satisfaction: z.enum([
		'5', '4', '3', '2', '1',
	], { required_error: 'Please select a rating.' }),
	goals: z.enum([
		'5', '4', '3', '2', '1',
	], { required_error: 'Please select a rating.' }),
	likeMost: z.string().min(2, 'Please tell us what you liked most.'),
	improve: z.string().min(2, 'Please tell us what we could improve.'),
	recommend: z.enum(['yes', 'maybe', 'no'], { required_error: 'Please select an option.' }),
	testimonial: z.string().optional(),
	name: z.string().optional(),
});

const Feedback = () => {
	const { toast } = useToast();
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			satisfaction: undefined,
			goals: undefined,
			likeMost: '',
			improve: '',
			recommend: undefined,
			testimonial: '',
			name: '',
		},
	});

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		try {
			const response = await apiFetch('feedback', {
				method: 'POST',
				body: JSON.stringify(values),
			});
			if (!response.ok) throw new Error('Failed to submit feedback');
			toast({
				title: 'Thank you!',
				description: 'Your feedback has been submitted.',
			});
			form.reset();
		} catch (err: any) {
			toast({
				title: 'Error',
				description: err.message || 'Could not submit feedback.',
				variant: 'destructive',
			});
		}
	};

	return (
		<PageLayout>
			<div className="max-w-2xl mx-auto px-4 py-10">
				<h1 className="text-3xl font-bold text-center mb-2 text-musinova-darkgray">MusiNova Artist Feedback Form</h1>
				<p className="text-center text-gray-600 mb-8">Thank you for using our playlist promotion service! Your feedback helps us improve and support more artists like you.</p>
				<Card className="border border-musinova-green/50 shadow-md bg-musinova-lightyellow/30 hover:shadow-lg transition-all">
					<CardContent className="p-6 md:p-8">
						<Form {...form}>
							<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
								{/* 1. Satisfaction */}
								<FormField
									control={form.control}
									name="satisfaction"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="font-semibold">1. How satisfied are you with the service?</FormLabel>
											<FormControl>
												<RadioGroup
													onValueChange={field.onChange}
													value={field.value}
													className="flex flex-col gap-2 mt-2"
												>
													<label className="flex items-center gap-2 cursor-pointer">
														<RadioGroupItem value="5" />
														<span>⭐⭐⭐⭐⭐ Very satisfied</span>
													</label>
													<label className="flex items-center gap-2 cursor-pointer">
														<RadioGroupItem value="4" />
														<span>⭐⭐⭐⭐ Satisfied</span>
													</label>
													<label className="flex items-center gap-2 cursor-pointer">
														<RadioGroupItem value="3" />
														<span>⭐⭐⭐ Neutral</span>
													</label>
													<label className="flex items-center gap-2 cursor-pointer">
														<RadioGroupItem value="2" />
														<span>⭐⭐ Unsatisfied</span>
													</label>
													<label className="flex items-center gap-2 cursor-pointer">
														<RadioGroupItem value="1" />
														<span>⭐ Very unsatisfied</span>
													</label>
												</RadioGroup>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								{/* 2. Goals */}
								<FormField
									control={form.control}
									name="goals"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="font-semibold">2. Did our promotion help you reach your goals (streams, followers, algorithm boost, etc.)?</FormLabel>
											<FormControl>
												<RadioGroup
													onValueChange={field.onChange}
													value={field.value}
													className="flex flex-col gap-2 mt-2"
												>
													<label className="flex items-center gap-2 cursor-pointer">
														<RadioGroupItem value="5" />
														<span>⭐⭐⭐⭐⭐ Exceeded my expectations</span>
													</label>
													<label className="flex items-center gap-2 cursor-pointer">
														<RadioGroupItem value="4" />
														<span>⭐⭐⭐⭐ Met my goals</span>
													</label>
													<label className="flex items-center gap-2 cursor-pointer">
														<RadioGroupItem value="3" />
														<span>⭐⭐⭐ Some progress, but less than I hoped</span>
													</label>
													<label className="flex items-center gap-2 cursor-pointer">
														<RadioGroupItem value="2" />
														<span>⭐⭐ Very little progress</span>
													</label>
													<label className="flex items-center gap-2 cursor-pointer">
														<RadioGroupItem value="1" />
														<span>⭐ No noticeable results</span>
													</label>
												</RadioGroup>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								{/* 3. What did you like most? */}
								<FormField
									control={form.control}
									name="likeMost"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="font-semibold">3. What did you like most about working with us?</FormLabel>
											<FormControl>
												<Textarea placeholder="Your answer..." {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								{/* 4. What could we improve? */}
								<FormField
									control={form.control}
									name="improve"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="font-semibold">4. What could we improve?</FormLabel>
											<FormControl>
												<Textarea placeholder="Your answer..." {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								{/* 5. Recommend */}
								<FormField
									control={form.control}
									name="recommend"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="font-semibold">5. Would you recommend Musi-Nova to other artists?</FormLabel>
											<FormControl>
												<RadioGroup
													onValueChange={field.onChange}
													value={field.value}
													className="flex flex-col gap-2 mt-2"
												>
													<label className="flex items-center gap-2 cursor-pointer">
														<RadioGroupItem value="yes" />
														<span>Yes</span>
													</label>
													<label className="flex items-center gap-2 cursor-pointer">
														<RadioGroupItem value="maybe" />
														<span>Maybe</span>
													</label>
													<label className="flex items-center gap-2 cursor-pointer">
														<RadioGroupItem value="no" />
														<span>No</span>
													</label>
												</RadioGroup>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								{/* 6. Testimonial (optional) */}
								<FormField
									control={form.control}
									name="testimonial"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="font-semibold">6. (Optional) Would you like to provide a short testimonial we can share?</FormLabel>
											<FormControl>
												<Textarea placeholder="Your testimonial..." {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								{/* 7. Name (optional) */}
								<FormField
									control={form.control}
									name="name"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="font-semibold">7. (Optional) Your name / artist name:</FormLabel>
											<FormControl>
												<Textarea placeholder="Your name or artist name..." {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<div className="flex justify-center pt-2">
									<Button type="submit" className="btn-primary w-full md:w-auto">Submit Feedback</Button>
								</div>
							</form>
						</Form>
					</CardContent>
				</Card>
			</div>
		</PageLayout>
	);
};

export default Feedback;
