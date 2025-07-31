import { useState } from 'react';
import { Analytics } from '@/utils/analytics';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

function DevAnalyticsTest() {
  const [events, setEvents] = useState<Array<{ method: string; args: any[]; timestamp: number }>>([]);
  const [validationResults, setValidationResults] = useState<any>(null);
  
  // Override analytics methods to capture calls
  const captureEvent = (method: string, args: any[]) => {
    setEvents(prev => [...prev, { method, args, timestamp: Date.now() }]);
  };
  
  const runValidation = async () => {
    try {
      const validator = new (await import('@/utils/analyticsValidator')).AnalyticsValidator(Analytics);
      const results = await validator.validateAll();
      setValidationResults(results);
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };
  
  const testMethods = [
    {
      category: 'Page Tracking',
      tests: [
        {
          name: 'Track Page View',
          action: () => {
            Analytics.trackPageView('/test-page', { source: 'test-harness' });
            captureEvent('trackPageView', ['/test-page', { source: 'test-harness' }]);
          }
        },
        {
          name: 'Track Page Exit',
          action: () => {
            Analytics.trackEvent('page_exited', { path: '/test', time_on_page_seconds: 30 });
            captureEvent('trackEvent', ['page_exited', { path: '/test', time_on_page_seconds: 30 }]);
          }
        }
      ]
    },
    {
      category: 'User Identification',
      tests: [
        {
          name: 'Identify User',
          action: () => {
            Analytics.identifyUser('test_user_123', { email: 'test@example.com', plan: 'premium' });
            captureEvent('identifyUser', ['test_user_123', { email: 'test@example.com', plan: 'premium' }]);
          }
        }
      ]
    },
    {
      category: 'CTA Tracking',
      tests: [
        {
          name: 'Track CTA Click',
          action: () => {
            Analytics.trackEvent('cta_clicked', {
              cta_location: 'test_harness',
              cta_text: 'Test Button',
              cta_variant: 'primary',
              plan_type: 'standard'
            });
            captureEvent('trackEvent', ['cta_clicked', { cta_location: 'test_harness', cta_text: 'Test Button' }]);
          }
        },
        {
          name: 'Track Button Click',
          action: () => {
            Analytics.trackButtonClick('test_button', 'test_harness');
            captureEvent('trackButtonClick', ['test_button', 'test_harness']);
          }
        }
      ]
    },
    {
      category: 'Content Engagement',
      tests: [
        {
          name: 'Track Article View',
          action: () => {
            Analytics.trackArticleView('123', 'Test Article', 'John Doe', 'Testing');
            captureEvent('trackArticleView', ['123', 'Test Article', 'John Doe', 'Testing']);
          }
        },
        {
          name: 'Track Scroll Milestone',
          action: () => {
            Analytics.trackEvent('scroll_milestone_reached', { milestone: 50, path: '/test' });
            captureEvent('trackEvent', ['scroll_milestone_reached', { milestone: 50, path: '/test' }]);
          }
        }
      ]
    },
    {
      category: 'Checkout Flow',
      tests: [
        {
          name: 'Track Checkout Modal Opened',
          action: () => {
            Analytics.trackEvent('checkout_modal_opened', { plan_id: 'test_plan', device: 'desktop' });
            captureEvent('trackEvent', ['checkout_modal_opened', { plan_id: 'test_plan', device: 'desktop' }]);
          }
        },
        {
          name: 'Track Checkout Completed',
          action: () => {
            Analytics.trackEvent('checkout_completed', { plan_id: 'test_plan', order_id: '12345' });
            captureEvent('trackEvent', ['checkout_completed', { plan_id: 'test_plan', order_id: '12345' }]);
          }
        }
      ]
    },
    {
      category: 'Error Tracking',
      tests: [
        {
          name: 'Capture Exception',
          action: () => {
            Analytics.captureException(new Error('Test error from harness'), { source: 'test_harness' });
            captureEvent('captureException', [new Error('Test error from harness'), { source: 'test_harness' }]);
          }
        }
      ]
    }
  ];
  
  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Analytics Test Harness</h1>
        <p className="text-gray-400 mb-8">Development only - Test all analytics methods</p>
        
        <div className="mb-8">
          <Button onClick={runValidation} className="bg-gold hover:bg-gold/90 text-black">
            Run Analytics Validation
          </Button>
        </div>
        
        {validationResults && (
          <Card className="mb-8 p-6 bg-gray-900 border-gray-800">
            <h2 className="text-xl font-bold mb-4">Validation Results</h2>
            <div className={`mb-2 ${validationResults.valid ? 'text-green-500' : 'text-red-500'}`}>
              Status: {validationResults.valid ? '✅ Valid' : '❌ Invalid'}
            </div>
            {validationResults.errors.length > 0 && (
              <div className="mb-4">
                <h3 className="font-bold text-red-500">Errors:</h3>
                <ul className="list-disc list-inside">
                  {validationResults.errors.map((error: string, i: number) => (
                    <li key={i} className="text-red-400">{error}</li>
                  ))}
                </ul>
              </div>
            )}
            {validationResults.warnings.length > 0 && (
              <div className="mb-4">
                <h3 className="font-bold text-yellow-500">Warnings:</h3>
                <ul className="list-disc list-inside">
                  {validationResults.warnings.map((warning: string, i: number) => (
                    <li key={i} className="text-yellow-400">{warning}</li>
                  ))}
                </ul>
              </div>
            )}
            <div>
              <h3 className="font-bold text-green-500">Tested Methods:</h3>
              <div className="text-green-400">
                {validationResults.testedMethods.join(', ')}
              </div>
            </div>
          </Card>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-bold mb-4">Test Analytics Methods</h2>
            {testMethods.map(category => (
              <Card key={category.category} className="mb-4 p-4 bg-gray-900 border-gray-800">
                <h3 className="text-lg font-semibold mb-3 text-gold">{category.category}</h3>
                <div className="space-y-2">
                  {category.tests.map(test => (
                    <Button
                      key={test.name}
                      onClick={test.action}
                      variant="outline"
                      className="w-full justify-start"
                    >
                      {test.name}
                    </Button>
                  ))}
                </div>
              </Card>
            ))}
          </div>
          
          <div>
            <h2 className="text-2xl font-bold mb-4">Event Log</h2>
            <Card className="p-4 bg-gray-900 border-gray-800 max-h-[600px] overflow-y-auto">
              {events.length === 0 ? (
                <p className="text-gray-500">No events tracked yet. Click buttons to test.</p>
              ) : (
                <div className="space-y-2">
                  {events.map((event, i) => (
                    <div key={i} className="p-2 bg-gray-800 rounded text-sm">
                      <div className="font-mono text-gold">{event.method}</div>
                      <pre className="text-xs text-gray-400 mt-1 overflow-x-auto">
                        {JSON.stringify(event.args, null, 2)}
                      </pre>
                    </div>
                  ))}
                </div>
              )}
            </Card>
            
            <div className="mt-4 space-x-2">
              <Button 
                onClick={() => setEvents([])} 
                variant="outline"
                size="sm"
              >
                Clear Log
              </Button>
              <Button
                onClick={() => {
                  console.log('Event Log:', events);
                  alert(`${events.length} events logged. Check console for details.`);
                }}
                variant="outline"
                size="sm"
              >
                Export to Console
              </Button>
            </div>
          </div>
        </div>
        
        <div className="mt-8 p-4 bg-yellow-900/20 border border-yellow-600/50 rounded">
          <p className="text-yellow-500 text-sm">
            ⚠️ This page is only available in development mode and will not be included in production builds.
          </p>
        </div>
      </div>
    </div>
  );
}

// Only export in development mode to prevent accidental inclusion in production
export default import.meta.env.DEV ? DevAnalyticsTest : (() => null);