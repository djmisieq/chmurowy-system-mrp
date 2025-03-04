import MainLayout from '../../components/layout/MainLayout';

export default function SettingsPage() {
  return (
    <MainLayout>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">Ustawienia systemu</h2>
        <p className="mt-1 text-sm text-gray-500">Dostosuj parametry działania systemu MRP</p>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Ustawienia systemu</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Dostosuj parametry działania systemu MRP</p>
        </div>

        <form>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-6">
                <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Ustawienia ogólne</h3>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
                  Nazwa firmy
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="companyName"
                    id="companyName"
                    defaultValue="Stocznia Jachtowa XYZ"
                    className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="currency" className="block text-sm font-medium text-gray-700">
                  Waluta
                </label>
                <div className="mt-1">
                  <select
                    id="currency"
                    name="currency"
                    defaultValue="PLN"
                    className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  >
                    <option value="PLN">PLN</option>
                    <option value="EUR">EUR</option>
                    <option value="USD">USD</option>
                  </select>
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="language" className="block text-sm font-medium text-gray-700">
                  Język
                </label>
                <div className="mt-1">
                  <select
                    id="language"
                    name="language"
                    defaultValue="pl"
                    className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  >
                    <option value="pl">Polski</option>
                    <option value="en">Angielski</option>
                    <option value="de">Niemiecki</option>
                  </select>
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="timeZone" className="block text-sm font-medium text-gray-700">
                  Strefa czasowa
                </label>
                <div className="mt-1">
                  <select
                    id="timeZone"
                    name="timeZone"
                    defaultValue="Europe/Warsaw"
                    className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  >
                    <option value="Europe/Warsaw">Europe/Warsaw</option>
                    <option value="Europe/London">Europe/London</option>
                    <option value="Europe/Berlin">Europe/Berlin</option>
                  </select>
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="systemTheme" className="block text-sm font-medium text-gray-700">
                  Motyw systemu
                </label>
                <div className="mt-1">
                  <select
                    id="systemTheme"
                    name="systemTheme"
                    defaultValue="light"
                    className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  >
                    <option value="light">Jasny</option>
                    <option value="dark">Ciemny</option>
                    <option value="system">Systemowy</option>
                  </select>
                </div>
              </div>

              <div className="sm:col-span-3">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="emailNotifications"
                      name="emailNotifications"
                      type="checkbox"
                      defaultChecked
                      className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="emailNotifications" className="font-medium text-gray-700">
                      Powiadomienia e-mail
                    </label>
                    <p className="text-gray-500">Otrzymuj powiadomienia e-mail o ważnych zdarzeniach w systemie.</p>
                  </div>
                </div>
              </div>

              <div className="sm:col-span-6">
                <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4 pt-4">Ustawienia produkcji</h3>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="defaultLeadTime" className="block text-sm font-medium text-gray-700">
                  Domyślny czas realizacji (dni)
                </label>
                <div className="mt-1">
                  <input
                    type="number"
                    name="defaultLeadTime"
                    id="defaultLeadTime"
                    defaultValue="14"
                    className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="workingHours" className="block text-sm font-medium text-gray-700">
                  Godziny pracy
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="workingHours"
                    id="workingHours"
                    defaultValue="8-16"
                    className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="sm:col-span-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Dni robocze</label>
                <div className="flex flex-wrap gap-4">
                  {[
                    { id: 'monday', label: 'Poniedziałek', defaultChecked: true },
                    { id: 'tuesday', label: 'Wtorek', defaultChecked: true },
                    { id: 'wednesday', label: 'Środa', defaultChecked: true },
                    { id: 'thursday', label: 'Czwartek', defaultChecked: true },
                    { id: 'friday', label: 'Piątek', defaultChecked: true },
                    { id: 'saturday', label: 'Sobota', defaultChecked: false },
                    { id: 'sunday', label: 'Niedziela', defaultChecked: false },
                  ].map((day) => (
                    <div key={day.id} className="flex items-center">
                      <input
                        id={day.id}
                        name="workingDays"
                        type="checkbox"
                        defaultChecked={day.defaultChecked}
                        className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                      />
                      <label htmlFor={day.id} className="ml-2 text-sm text-gray-700">
                        {day.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="sm:col-span-6">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="autoScheduleProduction"
                      name="autoScheduleProduction"
                      type="checkbox"
                      defaultChecked
                      className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="autoScheduleProduction" className="font-medium text-gray-700">
                      Automatyczne planowanie produkcji
                    </label>
                    <p className="text-gray-500">System automatycznie zaplanuje produkcję na podstawie zamówień.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
            <button
              type="submit"
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Zapisz ustawienia
            </button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
}
