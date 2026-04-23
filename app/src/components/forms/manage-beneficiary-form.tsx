import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Resolver, useForm } from "react-hook-form";
import * as z from "zod";
import { Button, buttonVariants } from "../ui/button";
import { Label } from "../ui/label";
import {
  MultiSelector,
  MultiSelectorContent,
  MultiSelectorInput,
  MultiSelectorItem,
  MultiSelectorList,
  MultiSelectorTrigger,
} from "../ui/multi-select";
import { useEffect, useState } from "react";
import { Icons } from "../icons";
import {
  ISupportingServiceActivityPerson,
  SupportServiceActivity,
} from "@/types/support-service";
import { Facility, Person } from "@/types/farm";
import { Input } from "../ui/input";
import { useToast } from "../ui/use-toast";
import { postPerson } from "@/services/person-service";
import { updateActivity } from "@/services/supportingService-service";
import { Plus } from "lucide-react";
import { Separator } from "../ui/separator";
import { UserWithToken } from "@/types/auth";
import { ILocation } from "@/types/location";

interface IManageBeneficiaryProps {
  currentUser: UserWithToken | undefined;
  organisation: string;
  activity?: SupportServiceActivity;
  setIsCloseable: (isCloseable: boolean) => void;
  farmerGroups: ILocation[];
}

const baseSchema = z.object({
  personIds: z.array(z.string()).nonempty("At least one person is required"),
});

const addFarmerSchema = z.object({
  lastName: z.string().nonempty("Last name is required"),
  firstName: z.string().nonempty("First name is required"),
  email: z.string().email("Invalid email address").optional(),
  phone: z
    .string()
    .regex(/^\d+$/, "Phone number must contain only digits")
    .nonempty("Phone number is required"),
});

type BaseFormData = z.infer<typeof baseSchema>;
type AddFarmerFormData = z.infer<typeof addFarmerSchema>;

export const ManageBeneficiariesForm = ({
  currentUser,
  organisation,
  activity,
  setIsCloseable,
  farmerGroups,
}: IManageBeneficiaryProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isActivityLoading, setIsActivityLoading] = useState<boolean>(false);
  const [persons, setPersons] = useState<Person[]>([]);
  const [selectedPersons, setSelectedPersons] = useState<Person[]>([]);
  const [isAddingFarmer, setIsAddingFarmer] = useState<boolean>(false);
  const [isSubmitEnabled, setIsSubmitEnabled] = useState<boolean>(false);
  const baseFormOptions = {
    resolver: zodResolver(baseSchema) as Resolver<BaseFormData>,
  };
  const addFarmerFormOptions = {
    resolver: zodResolver(addFarmerSchema) as Resolver<AddFarmerFormData>,
  };

  const {
    handleSubmit: handleBeneficiaries,
    formState: { errors: baseErrors },
    setValue: setBaseValue,
    getValues: getBaseValues,
    setError: setBaseError,
  } = useForm<BaseFormData>(baseFormOptions);

  const {
    register: addFarmerRegister,
    handleSubmit: handleAddFarmerSubmit,
    formState: { errors: addFarmerErrors },
    reset: resetAddFarmerForm,
  } = useForm<AddFarmerFormData>(addFarmerFormOptions);

  useEffect(() => {
    // Populate form fields if activity is provided
    if (activity) {
      const mainContactPersons = activity.serviceActivityLocations?.flatMap(
        (item: ILocation) =>
          item.location.facilitiesCustom
            .filter((facility: Facility) => facility.mainContactPerson)
            .map((facility: Facility) => ({
              locationId: item.location.id,
              locationName: item.location.name,
              ...facility.mainContactPerson,
            }))
      );
      let uniquePersonsMap = new Map();
      if (activity.ServiceActivityBeneficiaries) {
        const beneficiaries = activity.ServiceActivityBeneficiaries?.map(
          ({ person }: any) => person
        );
        beneficiaries.forEach((person: Person) =>
          uniquePersonsMap.set(person.id, person)
        );
      }

      if (mainContactPersons && mainContactPersons.length > 0) {
        mainContactPersons.map((mainContactPerson: Person) =>
          uniquePersonsMap.set(mainContactPerson.id, mainContactPerson)
        );
      }
      const constructPersons = Array.from(uniquePersonsMap.values())?.map(
        (person: any) => ({
          id: person.id,
          shortCode: person.shortCode,
          name: person.firstName + " " + person.lastName,
          formattedData: `${person.type || "Unknown Type"} / ${person.shortCode}`,
          ...person,
        })
      );
      setPersons(constructPersons);
      if (activity?.ServiceActivityBeneficiaries) {
        setSelectedPersons(
          activity?.ServiceActivityBeneficiaries?.map(({ person }: any) => {
            return {
              id: person.id,
              shortCode: person.shortCode,
              name: person.firstName + " " + person.lastName,
              formattedData: `${person.type || "Unknown Type"} / ${person.shortCode}`,
              ...person,
            } as Person;
          })
        );
      }

      setBaseValue("personIds", activity.personIds as [string, ...string[]]);
    }
  }, [activity]);

  async function onUpdateBeneficiaries(formData: BaseFormData) {
    setIsActivityLoading(true);
    try {
      const query = await updateActivity(
        organisation,
        activity?.id,
        { personIds: formData.personIds },
        currentUser?.accessToken
      );
      if (query) {
        toast({
          title: "Success",
          description: "Activity updated successfully",
        });
        setIsSubmitEnabled(false);
        setIsCloseable(true);
      } else {
        toast({
          title: "Error",
          description: "Failed to update activity",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsActivityLoading(false);
    }
  }

  async function onSubmitAddFarmer(formData: AddFarmerFormData) {
    setIsLoading(true);
    try {
      let data: Person & { email?: string } = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email ?? "",
        phone: formData.phone,
        type: "Farmer",
        shortCode:
          formData.firstName.slice(0, 3) + formData.lastName.slice(0, 3),
      } as Person & { email?: string };

      let query = await postPerson(
        organisation,
        data,
        currentUser?.accessToken
      );
      if (query) {
        const newPerson = {
          ...query,
          id: query.id,
          shortCode: query.shortCode,
          name: query.firstName + " " + query.lastName,
          formattedData: `${query.type || "Unknown Type"} / ${query.shortCode}`,
        };
        setPersons([...persons, newPerson]);
        setSelectedPersons([...selectedPersons, newPerson]);
        setBaseValue("personIds", [...getBaseValues("personIds"), query.id]);
        setIsSubmitEnabled(true);
        setIsAddingFarmer(false);
        setIsCloseable(false);
        resetAddFarmerForm();
      } else {
        toast({
          title: "Error",
          description: "Failed to add farmer",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.log(error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handleValuesChange = (selectedNames: string[]) => {
    if (selectedNames.length === 0) {
      setBaseError("personIds", {
        type: "required",
        message: "Please select at least one person",
      });
      return; // Do nothing if the last item is being removed
    }
    const selectedPersons: Person[] =
      persons
        .filter((person: Person) => selectedNames.includes(person.name ?? ""))
        .map((person: Person) => ({
          name: person.firstName + " " + person.lastName,
          formattedData: `${person.type || "Unknown Type"} / ${person.shortCode}`,
          ...person,
        })) ?? [];

    setSelectedPersons(selectedPersons);
    setBaseValue(
      "personIds",
      selectedPersons.map((person) => person.id) as [string, ...string[]]
    );
    setIsSubmitEnabled(true);
  };

  const getSelectedNames = () => {
    return activity?.farmerGroupIds
      ?.map(
        (id: string) => farmerGroups?.find((item) => item.id === id)?.name || ""
      )
      .filter(Boolean);
  };

  const getSelectedFarmerNames = () => {
    return selectedPersons
      ?.map(
        (item: any) =>
          persons?.find((person) => item.id === person.id)?.name || ""
      )
      .filter(Boolean);
  };

  return (
    <div className={cn("grid gap-6 grow")}>
      <div className="flex flex-col gap-4">
        <div className="grow">
          <div className="flex gap-4">
            <div className="grid gap-0 grow">
              <Label htmlFor="persons">Farmer Groups</Label>
              <MultiSelector values={getSelectedNames() || []}>
                <MultiSelectorTrigger>
                  <MultiSelectorInput placeholder="Farmer Groups" />
                </MultiSelectorTrigger>
                <MultiSelectorContent>
                  <MultiSelectorList>
                    {farmerGroups.map((farmerGroup: any) => (
                      <MultiSelectorItem
                        key={farmerGroup.id}
                        value={farmerGroup.id}
                        disabled
                      >
                        {farmerGroup.name}
                      </MultiSelectorItem>
                    ))}
                  </MultiSelectorList>
                </MultiSelectorContent>
              </MultiSelector>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="grid gap-0 grow">
              <Label htmlFor="persons">Farmers</Label>
              <MultiSelector
                values={getSelectedFarmerNames() || []}
                onValuesChange={handleValuesChange}
              >
                <MultiSelectorTrigger>
                  <MultiSelectorInput placeholder="Select farmers" />
                </MultiSelectorTrigger>
                <MultiSelectorContent>
                  <MultiSelectorList>
                    {persons.map((person) => (
                      <MultiSelectorItem
                        key={person.id}
                        value={person.name ?? ""}
                        shortCode={person.shortCode ?? ""}
                      >
                        <div className="w-full flex justify-between px-4">
                          <span>{person.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {person?.formattedData ?? person?.shortCode}
                          </span>
                        </div>
                      </MultiSelectorItem>
                    ))}
                  </MultiSelectorList>
                </MultiSelectorContent>
              </MultiSelector>
              {baseErrors?.personIds && (
                <p className="px-1 text-xs text-red-600">
                  {baseErrors.personIds.message}
                </p>
              )}
            </div>
            {!isAddingFarmer && (
              <div className="flex-none flex items-end pb-2">
                <Button
                  className="h-8 w-8"
                  size="icon"
                  disabled={isLoading || isActivityLoading}
                  onClick={() => setIsAddingFarmer(!isAddingFarmer)}
                >
                  <Plus className="h-6 w-6" />
                </Button>
              </div>
            )}
          </div>
          {isAddingFarmer && (
            <>
              <Separator className="my-2" />
              <form
                onSubmit={handleAddFarmerSubmit(onSubmitAddFarmer)}
                className="grid gap-4 mt-4"
              >
                <Label className="text-lg font-semibold">Add Farmer</Label>
                <div className="grid gap-2 grid-cols-1 sm:grid-cols-1 md:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      placeholder="First Name"
                      type="text"
                      autoCorrect="off"
                      disabled={isLoading}
                      {...addFarmerRegister("firstName")}
                    />
                    {addFarmerErrors?.firstName && (
                      <p className="px-1 text-xs text-red-600">
                        {addFarmerErrors.firstName.message}
                      </p>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      placeholder="Last Name"
                      type="text"
                      autoCorrect="off"
                      disabled={isLoading}
                      {...addFarmerRegister("lastName")}
                    />
                    {addFarmerErrors?.lastName && (
                      <p className="px-1 text-xs text-red-600">
                        {addFarmerErrors.lastName.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    placeholder="Email"
                    type="email"
                    autoCorrect="off"
                    disabled={isLoading}
                    {...addFarmerRegister("email")}
                  />
                  {addFarmerErrors?.email && (
                    <p className="px-1 text-xs text-red-600">
                      {addFarmerErrors.email.message}
                    </p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    placeholder="Phone"
                    type="text"
                    autoCorrect="off"
                    disabled={isLoading}
                    {...addFarmerRegister("phone")}
                  />
                  {addFarmerErrors?.phone && (
                    <p className="px-1 text-xs text-red-600">
                      {addFarmerErrors.phone.message}
                    </p>
                  )}
                </div>
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    className={cn(buttonVariants(), "w-24")}
                    disabled={isLoading}
                  >
                    {isLoading && (
                      <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    {"Save"}
                  </Button>
                </div>
              </form>
            </>
          )}
        </div>
        <div className="flex-none flex justify-center">
          <Button
            type="button"
            className={cn(buttonVariants(), "w-full")}
            disabled={isActivityLoading || !isSubmitEnabled}
            onClick={handleBeneficiaries(onUpdateBeneficiaries)}
          >
            {isActivityLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            {"Submit"}
          </Button>
        </div>
      </div>
    </div>
  );
};
